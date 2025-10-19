'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import toast from 'react-hot-toast';
import WizardLayout from '@/components/wizard/WizardLayout';
import Step1BasicDetails from '@/components/wizard/Step1BasicDetails';
import Step2Preferences from '@/components/wizard/Step2Preferences';
import Step3Review from '@/components/wizard/Step3Review';
import { TravelPlanFormData } from '@/types/plan';

const STORAGE_KEY = 'travel_plan_draft';

export default function NewPlanPage() {
  const router = useRouter();
  const [currentStep, setCurrentStep] = useState(1);
  const [generating, setGenerating] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});

  const [formData, setFormData] = useState<TravelPlanFormData>({
    planName: '',
    origin: { country: '', city: '' },
    destination: { country: '', city: '' },
    departureDate: '',
    returnDate: '',
    duration: 0,
    travelers: { adults: 1, children: 0, infants: 0 },
    budget: { currency: 'USD', min: 0, max: 0 },
    preferences: {
      tripPurpose: '',
      accommodationTypes: [],
      interests: [],
      travelPace: '',
      dietaryRestrictions: [],
      mustVisitPlaces: '',
      specialRequirements: '',
    },
  });

  // Load from localStorage on mount
  useEffect(() => {
    const saved = localStorage.getItem(STORAGE_KEY);
    if (saved) {
      try {
        const parsed = JSON.parse(saved);
        setFormData(parsed);
        toast.success('Loaded your draft');
      } catch {
        // Ignore parse errors
      }
    }
  }, []);

  // Auto-save to localStorage
  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(formData));
  }, [formData]);

  const handleFieldChange = (field: string, value: unknown) => {
    setFormData((prev) => ({
      ...prev,
      [field]: value,
    }));
    // Clear error for this field
    setErrors((prev) => {
      const updated = { ...prev };
      delete updated[field];
      return updated;
    });
  };

  const validateStep1 = (): boolean => {
    const newErrors: Record<string, string> = {};

    if (!formData.origin.country) newErrors.originCountry = 'Required';
    if (!formData.origin.city) newErrors.originCity = 'Required';
    if (!formData.destination.country) newErrors.destCountry = 'Required';
    if (!formData.destination.city) newErrors.destCity = 'Required';
    if (!formData.departureDate) newErrors.departureDate = 'Required';
    if (!formData.returnDate) newErrors.returnDate = 'Required';
    if (formData.travelers.adults < 1)
      newErrors.adults = 'At least 1 adult required';
    if (!formData.budget.currency) newErrors.currency = 'Required';
    if (formData.budget.min <= 0) newErrors.minBudget = 'Must be greater than 0';
    if (formData.budget.max <= formData.budget.min)
      newErrors.maxBudget = 'Must be greater than minimum';

    if (formData.returnDate && formData.departureDate) {
      const departure = new Date(formData.departureDate);
      const returnDate = new Date(formData.returnDate);
      if (returnDate <= departure) {
        newErrors.returnDate = 'Must be after departure date';
      }
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const validateStep2 = (): boolean => {
    const newErrors: Record<string, string> = {};

    if (!formData.preferences.tripPurpose)
      newErrors.tripPurpose = 'Required';
    if (formData.preferences.accommodationTypes.length === 0)
      newErrors.accommodationTypes = 'Select at least one';
    if (formData.preferences.interests.length === 0)
      newErrors.interests = 'Select at least one';
    if (!formData.preferences.travelPace) newErrors.travelPace = 'Required';

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleNext = () => {
    if (currentStep === 1) {
      if (validateStep1()) {
        // Calculate duration
        const departure = new Date(formData.departureDate);
        const returnDate = new Date(formData.returnDate);
        const duration = Math.ceil(
          (returnDate.getTime() - departure.getTime()) / (1000 * 60 * 60 * 24)
        );
        setFormData((prev) => ({ ...prev, duration }));
        setCurrentStep(2);
      }
    } else if (currentStep === 2) {
      if (validateStep2()) {
        setCurrentStep(3);
      }
    }
  };

  const handleBack = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1);
    }
  };

  const handleEditStep = (step: number) => {
    setCurrentStep(step);
  };

  const handleSaveDraft = async () => {
    try {
      // Auto-generate plan name
      const planName = `${formData.destination.city} Trip - ${new Date(
        formData.departureDate
      ).toLocaleDateString('en-US', { month: 'short', year: 'numeric' })}`;

      const response = await fetch('/api/plans', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ...formData,
          planName,
          departureDate: new Date(formData.departureDate).toISOString(),
          returnDate: new Date(formData.returnDate).toISOString(),
        }),
      });

      if (response.ok) {
        toast.success('Draft saved successfully');
        localStorage.removeItem(STORAGE_KEY);
        router.push('/dashboard');
      } else {
        const data = await response.json();
        toast.error(data.error || 'Failed to save draft');
      }
    } catch {
      toast.error('An error occurred while saving');
    }
  };

  const handleGenerate = async () => {
    setGenerating(true);
    try {
      // First save the plan
      const planName = `${formData.destination.city} Trip - ${new Date(
        formData.departureDate
      ).toLocaleDateString('en-US', { month: 'short', year: 'numeric' })}`;

      const createResponse = await fetch('/api/plans', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ...formData,
          planName,
          departureDate: new Date(formData.departureDate).toISOString(),
          returnDate: new Date(formData.returnDate).toISOString(),
        }),
      });

      if (!createResponse.ok) {
        const data = await createResponse.json();
        toast.error(data.error || 'Failed to create plan');
        setGenerating(false);
        return;
      }

      const { plan } = await createResponse.json();

      // TODO: Generate itinerary with OpenAI (Phase 6)
      // For now, just redirect to the plan page
      toast.success('Plan created! (Itinerary generation coming soon)');
      localStorage.removeItem(STORAGE_KEY);
      router.push(`/plan/${plan.id}`);
    } catch {
      toast.error('An error occurred while generating');
      setGenerating(false);
    }
  };

  return (
    <WizardLayout
      currentStep={currentStep}
      totalSteps={3}
      onBack={handleBack}
      onNext={currentStep < 3 ? handleNext : undefined}
      onSaveDraft={currentStep === 3 ? handleSaveDraft : undefined}
      showSaveDraft={currentStep === 3}
      nextLabel={currentStep === 2 ? 'Review' : 'Next'}
    >
      {currentStep === 1 && (
        <Step1BasicDetails
          formData={formData}
          errors={errors}
          onChange={handleFieldChange}
        />
      )}
      {currentStep === 2 && (
        <Step2Preferences
          formData={formData}
          errors={errors}
          onChange={handleFieldChange}
        />
      )}
      {currentStep === 3 && (
        <Step3Review
          formData={formData}
          onEdit={handleEditStep}
          onGenerate={handleGenerate}
          onSaveDraft={handleSaveDraft}
          generating={generating}
        />
      )}
    </WizardLayout>
  );
}
