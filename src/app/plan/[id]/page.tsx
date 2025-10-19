'use client';

import { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import toast from 'react-hot-toast';
import AppLayout from '@/components/layout/AppLayout';
import Spinner from '@/components/ui/Spinner';
import Button from '@/components/ui/Button';
import Card from '@/components/ui/Card';
import Badge from '@/components/ui/Badge';
import Link from 'next/link';
import FlightsSection from '@/components/itinerary/FlightsSection';
import AccommodationSection from '@/components/itinerary/AccommodationSection';
import DailyItinerarySection from '@/components/itinerary/DailyItinerarySection';
import BudgetSection from '@/components/itinerary/BudgetSection';
import TravelInfoSection from '@/components/itinerary/TravelInfoSection';
import { generateTravelPlanPDF } from '@/lib/pdfGenerator';

interface Activity {
  time: string;
  type: string;
  title: string;
  description: string;
  location: string;
  address?: string;
  duration: string;
  cost: number;
  openingHours?: string;
  travelTimeToNext?: string;
  notes?: string;
}

interface DayItinerary {
  day: number;
  date: string;
  theme?: string;
  weather?: string;
  activities: Activity[];
  dailyTotal: number;
}

interface FlightDetails {
  airline: string;
  flightNumber: string;
  departure: { airport: string; time: string; terminal?: string };
  arrival: { airport: string; time: string; terminal?: string };
  duration: string;
  class: string;
  estimatedCost: number;
  layovers?: Array<{ airport: string; duration: string }>;
  bookingTips?: string;
}

interface Accommodation {
  name: string;
  type: string;
  address: string;
  checkIn: string;
  checkOut: string;
  nights: number;
  pricePerNight: number;
  totalCost: number;
  amenities: string[];
  proximityToAttractions?: string;
  whyRecommended?: string;
}

interface BudgetBreakdown {
  flights: number;
  accommodation: number;
  food: number;
  activities: number;
  transportation: number;
  shopping: number;
  emergencyFund: number;
  total: number;
  perPerson: number;
  dailyAverage: number;
}

interface TravelInfo {
  visaRequirements: string;
  healthAndSafety: string;
  currency: {
    name: string;
    exchangeRate: string;
    tips: string;
  };
  language: {
    primary: string;
    usefulPhrases: string[];
  };
  simAndConnectivity: string;
  transportation: {
    overview: string;
    options: string[];
  };
  tipping: string;
  emergencyContacts: {
    police: string;
    ambulance: string;
    embassy: string;
  };
  weather: string;
  packingList: string[];
  culturalTips: string[];
}

interface TravelPlan {
  id: string;
  planName: string;
  origin: { country: string; city: string };
  destination: { country: string; city: string };
  departureDate: string;
  returnDate: string;
  duration: number;
  travelers: { adults: number; children: number; infants: number };
  budget: { currency: string; min: number; max: number };
  status: string;
  itinerary?: {
    dailyItinerary?: DayItinerary[];
    budgetBreakdown?: BudgetBreakdown;
    flights?: {
      outbound: FlightDetails;
      return: FlightDetails;
    };
    accommodation?: {
      primary: Accommodation;
      alternatives?: Accommodation[];
    };
    travelInfo?: TravelInfo;
  };
}

export default function PlanDetailPage() {
  const params = useParams();
  const router = useRouter();
  const [plan, setPlan] = useState<TravelPlan | null>(null);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('overview');
  const [isEditMode, setIsEditMode] = useState(false);
  const [isSaving, setIsSaving] = useState(false);

  const fetchPlan = async () => {
    try {
      setLoading(true);
      const response = await fetch(`/api/plans/${params.id}`);

      if (response.status === 404) {
        toast.error('Plan not found');
        router.push('/dashboard');
        return;
      }

      if (response.status === 403) {
        toast.error('Access denied');
        router.push('/dashboard');
        return;
      }

      if (!response.ok) {
        toast.error('Failed to load plan');
        return;
      }

      const data = await response.json();
      setPlan(data.plan);
    } catch {
      toast.error('An error occurred while loading the plan');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (params.id) {
      fetchPlan();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [params.id]);

  const handleUpdateActivity = (
    dayIndex: number,
    activityIndex: number,
    updatedActivity: Activity
  ) => {
    if (!plan?.itinerary?.dailyItinerary) return;

    const updatedPlan = { ...plan };
    if (updatedPlan.itinerary?.dailyItinerary) {
      updatedPlan.itinerary.dailyItinerary[dayIndex].activities[activityIndex] =
        updatedActivity;

      // Recalculate daily total
      updatedPlan.itinerary.dailyItinerary[dayIndex].dailyTotal =
        updatedPlan.itinerary.dailyItinerary[dayIndex].activities.reduce(
          (sum, activity) => sum + activity.cost,
          0
        );

      setPlan(updatedPlan);
    }
  };

  const handleSaveChanges = async () => {
    if (!plan) return;

    try {
      setIsSaving(true);
      const response = await fetch(`/api/plans/${params.id}`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          itinerary: plan.itinerary,
        }),
      });

      if (!response.ok) {
        toast.error('Failed to save changes');
        return;
      }

      toast.success('Changes saved successfully');
      setIsEditMode(false);
    } catch {
      toast.error('An error occurred while saving');
    } finally {
      setIsSaving(false);
    }
  };

  const handleCancelEdit = () => {
    setIsEditMode(false);
    fetchPlan(); // Reload original data
  };

  const handleFinalizePlan = async () => {
    if (!plan || plan.status === 'finalized') return;

    if (
      !confirm(
        'Are you sure you want to finalize this plan? Once finalized, you can still view and export it, but major changes will be locked.'
      )
    ) {
      return;
    }

    try {
      const response = await fetch(`/api/plans/${params.id}/finalize`, {
        method: 'POST',
      });

      if (!response.ok) {
        toast.error('Failed to finalize plan');
        return;
      }

      toast.success('Plan finalized successfully!');
      fetchPlan(); // Refresh to show new status
    } catch {
      toast.error('An error occurred while finalizing the plan');
    }
  };

  const handleExportPDF = () => {
    if (!plan || !plan.itinerary) return;

    try {
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      generateTravelPlanPDF(plan as any);
      toast.success('PDF downloaded successfully!');
    } catch (error) {
      console.error('PDF generation error:', error);
      toast.error('Failed to generate PDF');
    }
  };

  if (loading) {
    return (
      <AppLayout>
        <div className="flex items-center justify-center py-12">
          <Spinner size="lg" />
        </div>
      </AppLayout>
    );
  }

  if (!plan) {
    return (
      <AppLayout>
        <div className="max-w-7xl mx-auto py-12 px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-2xl font-bold text-white mb-4">
            Plan not found
          </h2>
          <Link href="/dashboard">
            <Button variant="gradient">Back to Dashboard</Button>
          </Link>
        </div>
      </AppLayout>
    );
  }

  const tabs = [
    { id: 'overview', name: 'Overview' },
    { id: 'flights', name: 'Flights', disabled: !plan.itinerary },
    { id: 'accommodation', name: 'Accommodation', disabled: !plan.itinerary },
    { id: 'itinerary', name: 'Daily Itinerary', disabled: !plan.itinerary },
    { id: 'budget', name: 'Budget', disabled: !plan.itinerary },
    { id: 'info', name: 'Travel Info', disabled: !plan.itinerary },
  ];

  const getStatusVariant = (status: string) => {
    switch (status) {
      case 'draft':
        return 'default';
      case 'generated':
        return 'info';
      case 'finalized':
        return 'success';
      default:
        return 'default';
    }
  };

  return (
    <AppLayout>
      <div className="max-w-7xl mx-auto py-6 px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="mb-6 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div className="flex-1">
            <h1 className="text-4xl font-bold text-white mb-2">
              {plan.planName}
            </h1>
            <p className="text-gray-300 flex items-center">
              <svg className="w-5 h-5 mr-2 text-purple-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
              </svg>
              {plan.destination.city}, {plan.destination.country} •{' '}
              {new Date(plan.departureDate).toLocaleDateString()} -{' '}
              {new Date(plan.returnDate).toLocaleDateString()}
            </p>
          </div>
          <div className="flex flex-wrap gap-2">
            <Link href="/dashboard">
              <Button variant="secondary" leftIcon={
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
                </svg>
              }>
                Back
              </Button>
            </Link>
            {plan.itinerary && !isEditMode && (
              <>
                {plan.status !== 'finalized' && (
                  <Button
                    variant="outline"
                    onClick={() => setIsEditMode(true)}
                    leftIcon={
                      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                      </svg>
                    }
                  >
                    Edit
                  </Button>
                )}
                {plan.status === 'generated' && (
                  <Button
                    variant="gradient"
                    onClick={handleFinalizePlan}
                    leftIcon={
                      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                      </svg>
                    }
                  >
                    Finalize Plan
                  </Button>
                )}
                <Button
                  variant="outline"
                  onClick={handleExportPDF}
                  leftIcon={
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                    </svg>
                  }
                >
                  Export PDF
                </Button>
              </>
            )}
            {isEditMode && (
              <>
                <Button variant="secondary" onClick={handleCancelEdit} disabled={isSaving}>
                  Cancel
                </Button>
                <Button variant="gradient" onClick={handleSaveChanges} loading={isSaving}>
                  {isSaving ? 'Saving...' : 'Save Changes'}
                </Button>
              </>
            )}
          </div>
        </div>

        {/* Status Banners */}
        {plan.status === 'draft' && (
          <Card className="mb-6 bg-yellow-500/10 border-yellow-500/30">
            <div className="p-6 flex items-start space-x-4">
              <div className="flex-shrink-0">
                <svg className="h-6 w-6 text-yellow-400" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                </svg>
              </div>
              <div className="flex-1">
                <h3 className="text-sm font-bold text-yellow-300">Draft Plan</h3>
                <p className="mt-1 text-sm text-yellow-200">
                  This plan hasn&apos;t been generated yet. Continue to the wizard to complete and generate your itinerary.
                </p>
                <div className="mt-4">
                  <Button variant="gradient" size="sm">Continue Planning</Button>
                </div>
              </div>
            </div>
          </Card>
        )}

        {plan.status === 'finalized' && (
          <Card className="mb-6 bg-green-500/10 border-green-500/30">
            <div className="p-6 flex items-start space-x-4">
              <div className="flex-shrink-0">
                <svg className="h-6 w-6 text-green-400" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                </svg>
              </div>
              <div>
                <h3 className="text-sm font-bold text-green-300">Plan Finalized</h3>
                <p className="mt-1 text-sm text-green-200">
                  This plan has been finalized and is ready for your trip! You can export it to PDF for offline access.
                </p>
              </div>
            </div>
          </Card>
        )}

        {isEditMode && (
          <Card className="mb-6 bg-blue-500/10 border-blue-500/30">
            <div className="p-6 flex items-start space-x-4">
              <div className="flex-shrink-0">
                <svg className="h-6 w-6 text-blue-400" fill="currentColor" viewBox="0 0 20 20">
                  <path d="M13.586 3.586a2 2 0 112.828 2.828l-.793.793-2.828-2.828.793-.793zM11.379 5.793L3 14.172V17h2.828l8.38-8.379-2.83-2.828z" />
                </svg>
              </div>
              <div>
                <h3 className="text-sm font-bold text-blue-300">Edit Mode Active</h3>
                <p className="mt-1 text-sm text-blue-200">
                  You can now edit activities in your itinerary. Click the edit icon next to any activity to modify it. Don&apos;t forget to save your changes when done.
                </p>
              </div>
            </div>
          </Card>
        )}

        {/* Tabs */}
        <div className="border-b border-white/20 mb-6">
          <nav className="-mb-px flex space-x-8 overflow-x-auto">
            {tabs.map((tab) => (
              <button
                key={tab.id}
                onClick={() => !tab.disabled && setActiveTab(tab.id)}
                disabled={tab.disabled}
                className={`${
                  activeTab === tab.id
                    ? 'border-purple-500 text-purple-300'
                    : 'border-transparent text-gray-400 hover:text-white hover:border-white/30'
                } ${
                  tab.disabled ? 'opacity-50 cursor-not-allowed' : ''
                } whitespace-nowrap py-4 px-1 border-b-2 font-semibold text-sm transition-all`}
              >
                {tab.name}
              </button>
            ))}
          </nav>
        </div>

        {/* Tab Content */}
        <div className="pb-12">
          {activeTab === 'overview' && (
            <div className="space-y-6">
              <Card>
                <div className="p-6">
                  <h2 className="text-2xl font-bold text-white mb-6">Trip Summary</h2>
                  <dl className="grid grid-cols-1 gap-6 sm:grid-cols-2">
                    <div>
                      <dt className="text-sm font-semibold text-gray-400">Origin</dt>
                      <dd className="mt-1 text-base text-white">{plan.origin.city}, {plan.origin.country}</dd>
                    </div>
                    <div>
                      <dt className="text-sm font-semibold text-gray-400">Destination</dt>
                      <dd className="mt-1 text-base text-white">{plan.destination.city}, {plan.destination.country}</dd>
                    </div>
                    <div>
                      <dt className="text-sm font-semibold text-gray-400">Departure</dt>
                      <dd className="mt-1 text-base text-white">
                        {new Date(plan.departureDate).toLocaleDateString('en-US', {
                          weekday: 'long',
                          year: 'numeric',
                          month: 'long',
                          day: 'numeric',
                        })}
                      </dd>
                    </div>
                    <div>
                      <dt className="text-sm font-semibold text-gray-400">Return</dt>
                      <dd className="mt-1 text-base text-white">
                        {new Date(plan.returnDate).toLocaleDateString('en-US', {
                          weekday: 'long',
                          year: 'numeric',
                          month: 'long',
                          day: 'numeric',
                        })}
                      </dd>
                    </div>
                    <div>
                      <dt className="text-sm font-semibold text-gray-400">Duration</dt>
                      <dd className="mt-1 text-base text-white">{plan.duration} days</dd>
                    </div>
                    <div>
                      <dt className="text-sm font-semibold text-gray-400">Travelers</dt>
                      <dd className="mt-1 text-base text-white">
                        {plan.travelers.adults + plan.travelers.children + plan.travelers.infants} people
                      </dd>
                    </div>
                    <div>
                      <dt className="text-sm font-semibold text-gray-400">Budget</dt>
                      <dd className="mt-1 text-base text-white">
                        {plan.budget.currency} {plan.budget.min.toLocaleString()} - {plan.budget.max.toLocaleString()}
                      </dd>
                    </div>
                    <div>
                      <dt className="text-sm font-semibold text-gray-400">Status</dt>
                      <dd className="mt-1">
                        <Badge variant={getStatusVariant(plan.status)}>
                          {plan.status.charAt(0).toUpperCase() + plan.status.slice(1)}
                        </Badge>
                      </dd>
                    </div>
                  </dl>
                </div>
              </Card>

              {plan.itinerary && (
                <Card>
                  <div className="p-6">
                    <h2 className="text-2xl font-bold text-white mb-6">Quick Stats</h2>
                    <div className="grid grid-cols-2 gap-4 sm:grid-cols-4">
                      <div className="text-center p-6 bg-purple-500/20 rounded-xl border border-purple-500/30">
                        <div className="text-3xl font-bold text-purple-300">
                          {plan.itinerary.dailyItinerary?.length || 0}
                        </div>
                        <div className="text-sm text-gray-300 mt-2">Days Planned</div>
                      </div>
                      <div className="text-center p-6 bg-green-500/20 rounded-xl border border-green-500/30">
                        <div className="text-3xl font-bold text-green-300">
                          {plan.budget.currency} {plan.itinerary.budgetBreakdown?.total?.toLocaleString() || '0'}
                        </div>
                        <div className="text-sm text-gray-300 mt-2">Estimated Total</div>
                      </div>
                      <div className="text-center p-6 bg-blue-500/20 rounded-xl border border-blue-500/30">
                        <div className="text-3xl font-bold text-blue-300">
                          {plan.itinerary.dailyItinerary?.reduce(
                            (sum: number, day: { activities?: unknown[] }) =>
                              sum + (day.activities?.length || 0),
                            0
                          ) || 0}
                        </div>
                        <div className="text-sm text-gray-300 mt-2">Total Activities</div>
                      </div>
                      <div className="text-center p-6 bg-pink-500/20 rounded-xl border border-pink-500/30">
                        <div className="text-3xl font-bold text-pink-300">
                          {plan.budget.currency} {plan.itinerary.budgetBreakdown?.dailyAverage?.toLocaleString() || '0'}
                        </div>
                        <div className="text-sm text-gray-300 mt-2">Daily Average</div>
                      </div>
                    </div>
                  </div>
                </Card>
              )}
            </div>
          )}

          {activeTab !== 'overview' && !plan.itinerary && (
            <div className="text-center py-12">
              <p className="text-gray-400">Complete the plan generation to view this section</p>
            </div>
          )}

          {activeTab === 'flights' && plan.itinerary?.flights && (
            <FlightsSection flights={plan.itinerary.flights} currency={plan.budget.currency} />
          )}

          {activeTab === 'accommodation' && plan.itinerary?.accommodation && (
            <AccommodationSection accommodation={plan.itinerary.accommodation} currency={plan.budget.currency} />
          )}

          {activeTab === 'itinerary' && plan.itinerary?.dailyItinerary && (
            <DailyItinerarySection
              dailyItinerary={plan.itinerary.dailyItinerary}
              currency={plan.budget.currency}
              editable={isEditMode}
              onUpdateActivity={handleUpdateActivity}
            />
          )}

          {activeTab === 'budget' && plan.itinerary?.budgetBreakdown && (
            <BudgetSection
              budgetBreakdown={plan.itinerary.budgetBreakdown}
              currency={plan.budget.currency}
              travelers={plan.travelers.adults + plan.travelers.children + plan.travelers.infants}
            />
          )}

          {activeTab === 'info' && plan.itinerary?.travelInfo && (
            <TravelInfoSection travelInfo={plan.itinerary.travelInfo} />
          )}
        </div>
      </div>
    </AppLayout>
  );
}
