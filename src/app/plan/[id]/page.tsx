'use client';

import { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import toast from 'react-hot-toast';
import AppLayout from '@/components/layout/AppLayout';
import Spinner from '@/components/ui/Spinner';
import Button from '@/components/ui/Button';
import Link from 'next/link';

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
    dailyItinerary?: Array<{ activities?: unknown[] }>;
    budgetBreakdown?: { total?: number; dailyAverage?: number };
  };
}

export default function PlanDetailPage() {
  const params = useParams();
  const router = useRouter();
  const [plan, setPlan] = useState<TravelPlan | null>(null);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('overview');

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
          <h2 className="text-2xl font-bold text-gray-900 mb-4">
            Plan not found
          </h2>
          <Link href="/dashboard">
            <Button>Back to Dashboard</Button>
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

  return (
    <AppLayout>
      <div className="max-w-7xl mx-auto py-6 px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="mb-6 flex flex-col sm:flex-row sm:items-center sm:justify-between">
          <div className="flex-1">
            <h1 className="text-3xl font-bold text-gray-900 mb-2">
              {plan.planName}
            </h1>
            <p className="text-gray-600">
              {plan.destination.city}, {plan.destination.country} •{' '}
              {new Date(plan.departureDate).toLocaleDateString()} -{' '}
              {new Date(plan.returnDate).toLocaleDateString()}
            </p>
          </div>
          <div className="mt-4 sm:mt-0 flex space-x-3">
            <Link href="/dashboard">
              <Button variant="secondary">
                <svg
                  className="w-5 h-5 mr-2"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M10 19l-7-7m0 0l7-7m-7 7h18"
                  />
                </svg>
                Back
              </Button>
            </Link>
            {plan.itinerary && (
              <Button variant="secondary">
                <svg
                  className="w-5 h-5 mr-2"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
                  />
                </svg>
                Export PDF
              </Button>
            )}
          </div>
        </div>

        {/* Status Banner */}
        {plan.status === 'draft' && (
          <div className="mb-6 bg-yellow-50 border border-yellow-200 rounded-lg p-4">
            <div className="flex">
              <div className="flex-shrink-0">
                <svg
                  className="h-5 w-5 text-yellow-400"
                  fill="currentColor"
                  viewBox="0 0 20 20"
                >
                  <path
                    fillRule="evenodd"
                    d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z"
                    clipRule="evenodd"
                  />
                </svg>
              </div>
              <div className="ml-3">
                <h3 className="text-sm font-medium text-yellow-800">
                  Draft Plan
                </h3>
                <p className="mt-1 text-sm text-yellow-700">
                  This plan hasn&apos;t been generated yet. Continue to the
                  wizard to complete and generate your itinerary.
                </p>
                <div className="mt-4">
                  <Button size="sm">Continue Planning</Button>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Tabs */}
        <div className="border-b border-gray-200 mb-6">
          <nav className="-mb-px flex space-x-8 overflow-x-auto">
            {tabs.map((tab) => (
              <button
                key={tab.id}
                onClick={() => !tab.disabled && setActiveTab(tab.id)}
                disabled={tab.disabled}
                className={`${
                  activeTab === tab.id
                    ? 'border-primary-500 text-primary-600'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                } ${
                  tab.disabled ? 'opacity-50 cursor-not-allowed' : ''
                } whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm`}
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
              <div className="bg-white shadow rounded-lg p-6">
                <h2 className="text-xl font-semibold mb-4">Trip Summary</h2>
                <dl className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                  <div>
                    <dt className="text-sm font-medium text-gray-500">
                      Origin
                    </dt>
                    <dd className="mt-1 text-sm text-gray-900">
                      {plan.origin.city}, {plan.origin.country}
                    </dd>
                  </div>
                  <div>
                    <dt className="text-sm font-medium text-gray-500">
                      Destination
                    </dt>
                    <dd className="mt-1 text-sm text-gray-900">
                      {plan.destination.city}, {plan.destination.country}
                    </dd>
                  </div>
                  <div>
                    <dt className="text-sm font-medium text-gray-500">
                      Departure
                    </dt>
                    <dd className="mt-1 text-sm text-gray-900">
                      {new Date(plan.departureDate).toLocaleDateString('en-US', {
                        weekday: 'long',
                        year: 'numeric',
                        month: 'long',
                        day: 'numeric',
                      })}
                    </dd>
                  </div>
                  <div>
                    <dt className="text-sm font-medium text-gray-500">
                      Return
                    </dt>
                    <dd className="mt-1 text-sm text-gray-900">
                      {new Date(plan.returnDate).toLocaleDateString('en-US', {
                        weekday: 'long',
                        year: 'numeric',
                        month: 'long',
                        day: 'numeric',
                      })}
                    </dd>
                  </div>
                  <div>
                    <dt className="text-sm font-medium text-gray-500">
                      Duration
                    </dt>
                    <dd className="mt-1 text-sm text-gray-900">
                      {plan.duration} days
                    </dd>
                  </div>
                  <div>
                    <dt className="text-sm font-medium text-gray-500">
                      Travelers
                    </dt>
                    <dd className="mt-1 text-sm text-gray-900">
                      {plan.travelers.adults +
                        plan.travelers.children +
                        plan.travelers.infants}{' '}
                      people
                    </dd>
                  </div>
                  <div>
                    <dt className="text-sm font-medium text-gray-500">
                      Budget
                    </dt>
                    <dd className="mt-1 text-sm text-gray-900">
                      {plan.budget.currency} {plan.budget.min.toLocaleString()}{' '}
                      - {plan.budget.max.toLocaleString()}
                    </dd>
                  </div>
                  <div>
                    <dt className="text-sm font-medium text-gray-500">
                      Status
                    </dt>
                    <dd className="mt-1">
                      <span
                        className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                          plan.status === 'draft'
                            ? 'bg-gray-100 text-gray-800'
                            : plan.status === 'generated'
                            ? 'bg-blue-100 text-blue-800'
                            : 'bg-green-100 text-green-800'
                        }`}
                      >
                        {plan.status.charAt(0).toUpperCase() +
                          plan.status.slice(1)}
                      </span>
                    </dd>
                  </div>
                </dl>
              </div>

              {plan.itinerary && (
                <div className="bg-white shadow rounded-lg p-6">
                  <h2 className="text-xl font-semibold mb-4">
                    Quick Stats
                  </h2>
                  <div className="grid grid-cols-2 gap-4 sm:grid-cols-4">
                    <div className="text-center p-4 bg-primary-50 rounded-lg">
                      <div className="text-2xl font-bold text-primary-600">
                        {plan.itinerary.dailyItinerary?.length || 0}
                      </div>
                      <div className="text-sm text-gray-600">Days Planned</div>
                    </div>
                    <div className="text-center p-4 bg-green-50 rounded-lg">
                      <div className="text-2xl font-bold text-green-600">
                        {plan.budget.currency}{' '}
                        {plan.itinerary.budgetBreakdown?.total?.toLocaleString() ||
                          '0'}
                      </div>
                      <div className="text-sm text-gray-600">
                        Estimated Total
                      </div>
                    </div>
                    <div className="text-center p-4 bg-blue-50 rounded-lg">
                      <div className="text-2xl font-bold text-blue-600">
                        {plan.itinerary.dailyItinerary?.reduce(
                          (sum: number, day: { activities?: unknown[] }) =>
                            sum + (day.activities?.length || 0),
                          0
                        ) || 0}
                      </div>
                      <div className="text-sm text-gray-600">
                        Total Activities
                      </div>
                    </div>
                    <div className="text-center p-4 bg-yellow-50 rounded-lg">
                      <div className="text-2xl font-bold text-yellow-600">
                        {plan.budget.currency}{' '}
                        {plan.itinerary.budgetBreakdown?.dailyAverage?.toLocaleString() ||
                          '0'}
                      </div>
                      <div className="text-sm text-gray-600">
                        Daily Average
                      </div>
                    </div>
                  </div>
                </div>
              )}
            </div>
          )}

          {activeTab !== 'overview' && !plan.itinerary && (
            <div className="text-center py-12">
              <p className="text-gray-500">
                Complete the plan generation to view this section
              </p>
            </div>
          )}

          {activeTab === 'flights' && plan.itinerary && (
            <div className="text-center py-12">
              <p className="text-gray-500">Flights section (coming soon)</p>
            </div>
          )}

          {activeTab === 'accommodation' && plan.itinerary && (
            <div className="text-center py-12">
              <p className="text-gray-500">
                Accommodation section (coming soon)
              </p>
            </div>
          )}

          {activeTab === 'itinerary' && plan.itinerary && (
            <div className="text-center py-12">
              <p className="text-gray-500">
                Daily itinerary section (coming soon)
              </p>
            </div>
          )}

          {activeTab === 'budget' && plan.itinerary && (
            <div className="text-center py-12">
              <p className="text-gray-500">Budget section (coming soon)</p>
            </div>
          )}

          {activeTab === 'info' && plan.itinerary && (
            <div className="text-center py-12">
              <p className="text-gray-500">Travel info section (coming soon)</p>
            </div>
          )}
        </div>
      </div>
    </AppLayout>
  );
}
