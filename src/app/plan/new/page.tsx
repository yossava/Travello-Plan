'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import toast from 'react-hot-toast';
import WizardLayout from '@/components/wizard/WizardLayout';
import Step1BasicDetails from '@/components/wizard/Step1BasicDetails';
import Step2Preferences from '@/components/wizard/Step2Preferences';
import Step3Review from '@/components/wizard/Step3Review';
import GeneratingModal from '@/components/wizard/GeneratingModal';
import { TravelPlanFormData } from '@/types/plan';

const STORAGE_KEY = 'travel_plan_draft';

export default function NewPlanPage() {
  const router = useRouter();
  const [currentStep, setCurrentStep] = useState(1);
  const [generating, setGenerating] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [planId, setPlanId] = useState<string | null>(null);

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

  // Load draft plan from API or localStorage on mount
  useEffect(() => {
    const loadDraftPlan = async () => {
      // Check if planId is in URL params
      const params = new URLSearchParams(window.location.search);
      const urlPlanId = params.get('planId');

      if (urlPlanId) {
        // Load from API
        try {
          const response = await fetch(`/api/plans/${urlPlanId}`);
          if (response.ok) {
            const data = await response.json();
            const plan = data.plan;

            // Convert plan data to form format
            setFormData({
              planName: plan.planName || '',
              origin: plan.origin,
              destination: plan.destination,
              departureDate: plan.departureDate ? new Date(plan.departureDate).toISOString().split('T')[0] : '',
              returnDate: plan.returnDate ? new Date(plan.returnDate).toISOString().split('T')[0] : '',
              duration: plan.duration,
              travelers: plan.travelers,
              budget: plan.budget,
              preferences: plan.preferences || {
                tripPurpose: '',
                accommodationTypes: [],
                interests: [],
                travelPace: '',
                dietaryRestrictions: [],
                mustVisitPlaces: '',
                specialRequirements: '',
              },
            });
            setPlanId(urlPlanId);
            toast.success('Loaded your draft plan');
            return;
          }
        } catch (error) {
          console.error('Failed to load draft plan:', error);
          toast.error('Failed to load draft plan');
        }
      }

      // Fallback to localStorage
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
    };

    loadDraftPlan();
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

      const payload = {
        ...formData,
        planName,
        departureDate: new Date(formData.departureDate).toISOString(),
        returnDate: new Date(formData.returnDate).toISOString(),
      };

      // Update existing plan or create new one
      const response = planId
        ? await fetch(`/api/plans/${planId}`, {
            method: 'PATCH',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(payload),
          })
        : await fetch('/api/plans', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(payload),
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
      // First save or update the plan
      const planName = `${formData.destination.city} Trip - ${new Date(
        formData.departureDate
      ).toLocaleDateString('en-US', { month: 'short', year: 'numeric' })}`;

      const payload = {
        ...formData,
        planName,
        departureDate: new Date(formData.departureDate).toISOString(),
        returnDate: new Date(formData.returnDate).toISOString(),
      };

      let currentPlanId = planId;

      // Update existing plan or create new one
      if (planId) {
        const updateResponse = await fetch(`/api/plans/${planId}`, {
          method: 'PATCH',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(payload),
        });

        if (!updateResponse.ok) {
          const data = await updateResponse.json();
          toast.error(data.error || 'Failed to update plan');
          setGenerating(false);
          return;
        }
      } else {
        const createResponse = await fetch('/api/plans', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(payload),
        });

        if (!createResponse.ok) {
          const data = await createResponse.json();
          toast.error(data.error || 'Failed to create plan');
          setGenerating(false);
          return;
        }

        const { plan } = await createResponse.json();
        currentPlanId = plan.id;
      }

      // Generate itinerary with OpenAI
      const generateResponse = await fetch('/api/ai/generate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ planId: currentPlanId }),
      });

      if (!generateResponse.ok) {
        const data = await generateResponse.json();
        toast.error(data.error || 'Failed to generate itinerary');
        setGenerating(false);
        // Redirect to plan page even if generation failed
        router.push(`/plan/${currentPlanId}`);
        return;
      }

      toast.success('Your travel plan is ready!');
      localStorage.removeItem(STORAGE_KEY);
      router.push(`/plan/${currentPlanId}`);
    } catch {
      toast.error('An error occurred while generating');
      setGenerating(false);
    }
  };

  return (
    <>
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
      <GeneratingModal isOpen={generating} />
    </>
  );
}
