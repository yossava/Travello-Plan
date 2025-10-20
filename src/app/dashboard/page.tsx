'use client';

import { useSession } from 'next-auth/react';
import { useState, useEffect } from 'react';
import Link from 'next/link';
import toast from 'react-hot-toast';
import AppLayout from '@/components/layout/AppLayout';
import Spinner from '@/components/ui/Spinner';
import PlanCard from '@/components/dashboard/PlanCard';
import EmptyState from '@/components/dashboard/EmptyState';
import Modal from '@/components/ui/Modal';
import Button from '@/components/ui/Button';

interface TravelPlan {
  id: string;
  planName: string;
  origin: {
    country: string;
    city: string;
  };
  destination: {
    country: string;
    city: string;
  };
  departureDate: Date;
  returnDate: Date;
  duration: number;
  travelers: {
    adults: number;
    children: number;
    infants: number;
  };
  budget: {
    currency: string;
    min: number;
    max: number;
  };
  status: string;
  createdAt: Date;
  updatedAt: Date;
  finalizedAt: Date | null;
}

export default function DashboardPage() {
  const { data: session, status } = useSession();
  const [plans, setPlans] = useState<TravelPlan[]>([]);
  const [loading, setLoading] = useState(true);
  const [deleteModalOpen, setDeleteModalOpen] = useState(false);
  const [planToDelete, setPlanToDelete] = useState<string | null>(null);
  const [deleting, setDeleting] = useState(false);

  const fetchPlans = async () => {
    try {
      setLoading(true);
      const response = await fetch('/api/plans');
      const data = await response.json();

      if (response.ok) {
        setPlans(data.plans);
      } else {
        toast.error('Failed to load plans');
      }
    } catch {
      toast.error('An error occurred while loading plans');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (status === 'authenticated') {
      fetchPlans();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [status]);

  const handleDeleteClick = (id: string) => {
    setPlanToDelete(id);
    setDeleteModalOpen(true);
  };

  const handleDeleteConfirm = async () => {
    if (!planToDelete) return;

    try {
      setDeleting(true);
      const response = await fetch(`/api/plans/${planToDelete}`, {
        method: 'DELETE',
      });

      if (response.ok) {
        toast.success('Plan deleted successfully');
        setPlans(plans.filter((p) => p.id !== planToDelete));
        setDeleteModalOpen(false);
        setPlanToDelete(null);
      } else {
        toast.error('Failed to delete plan');
      }
    } catch {
      toast.error('An error occurred while deleting the plan');
    } finally {
      setDeleting(false);
    }
  };

  if (status === 'loading' || loading) {
    return (
      <AppLayout>
        <div className="flex items-center justify-center py-12">
          <Spinner size="lg" />
        </div>
      </AppLayout>
    );
  }

  const stats = {
    total: plans.length,
    finalized: plans.filter(p => p.status === 'finalized').length,
    generated: plans.filter(p => p.status === 'generated').length,
    draft: plans.filter(p => p.status === 'draft').length,
  };

  return (
    <AppLayout>
      <div className="max-w-[1400px] mx-auto py-6 sm:py-10 px-4 sm:px-6 lg:px-8">
        {/* Elegant Header */}
        <div className="mb-12">
          <div className="flex flex-col lg:flex-row lg:items-start lg:justify-between gap-8">
            <div className="flex-1">
              <div className="inline-flex items-center gap-3 mb-4">
                <div className="h-12 w-1 bg-gradient-to-b from-blue-600 via-cyan-500 to-purple-600 rounded-full"></div>
                <div>
                  <p className="text-sm font-semibold text-gray-500 uppercase tracking-wider mb-1">Dashboard</p>
                  <h1 className="text-5xl md:text-6xl font-black text-gray-900 font-display leading-tight">
                    Welcome back,
                  </h1>
                  <h2 className="text-4xl md:text-5xl font-black bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600 bg-clip-text text-transparent font-display leading-tight">
                    {session?.user?.name?.split(' ')[0]}
                  </h2>
                </div>
              </div>
              <p className="text-lg text-gray-600 max-w-2xl mt-4">
                Manage your travel plans, track your adventures, and discover new destinations with AI-powered recommendations.
              </p>
            </div>

            <div className="flex flex-col gap-3">
              <Link href="/plan/new">
                <button className="group relative px-8 py-4 bg-gradient-to-r from-blue-600 via-blue-500 to-cyan-500 text-white rounded-2xl font-bold text-base hover:shadow-2xl hover:shadow-blue-500/50 transition-all duration-300 flex items-center gap-3 overflow-hidden">
                  <div className="absolute inset-0 bg-gradient-to-r from-cyan-500 to-blue-600 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                  <svg
                    className="w-5 h-5 relative z-10 group-hover:rotate-90 transition-transform duration-300"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                    strokeWidth={3}
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="M12 4v16m8-8H4"
                    />
                  </svg>
                  <span className="relative z-10">Create New Trip</span>
                </button>
              </Link>
              <button className="px-8 py-3 bg-white border-2 border-gray-200 text-gray-700 rounded-2xl font-semibold text-base hover:border-gray-300 hover:shadow-lg transition-all duration-300 flex items-center justify-center gap-2">
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
                </svg>
                View History
              </button>
            </div>
          </div>
        </div>

        {plans.length === 0 ? (
          <EmptyState />
        ) : (
          <>
            {/* Enterprise Stats Dashboard */}
            <div className="mb-10">
              {/* Stats Header */}
              <div className="flex items-center justify-between mb-6">
                <div>
                  <h2 className="text-2xl font-black text-gray-900 font-display mb-1">Analytics Overview</h2>
                  <p className="text-sm text-gray-600">Real-time insights into your travel planning</p>
                </div>
                <div className="hidden md:flex items-center gap-2 px-3 py-1.5 bg-gradient-to-r from-blue-50 to-purple-50 rounded-lg border border-blue-100">
                  <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
                  <span className="text-xs font-bold text-gray-700">Live</span>
                </div>
              </div>

              {/* Stats Grid */}
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                {/* Total Trips - Premium Card */}
                <div className="md:col-span-2 lg:col-span-1">
                  <div className="relative group h-full min-h-[200px]">
                    <div className="absolute -inset-0.5 bg-gradient-to-br from-blue-600 via-cyan-500 to-blue-400 rounded-2xl blur-lg opacity-30 group-hover:opacity-50 transition duration-500"></div>
                    <div className="relative h-full bg-gradient-to-br from-blue-600 via-blue-500 to-cyan-500 rounded-2xl p-6 shadow-xl flex flex-col justify-between overflow-hidden">
                      <div className="absolute top-0 right-0 w-32 h-32 bg-white/10 rounded-full blur-3xl"></div>
                      <div className="absolute bottom-0 left-0 w-24 h-24 bg-cyan-400/20 rounded-full blur-2xl"></div>

                      <div className="relative z-10">
                        <div className="inline-flex items-center justify-center w-12 h-12 bg-white/20 backdrop-blur-md rounded-xl mb-4 shadow-lg">
                          <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M3.055 11H5a2 2 0 012 2v1a2 2 0 002 2 2 2 0 012 2v2.945M8 3.935V5.5A2.5 2.5 0 0010.5 8h.5a2 2 0 012 2 2 2 0 104 0 2 2 0 012-2h1.064M15 20.488V18a2 2 0 012-2h3.064M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                          </svg>
                        </div>

                        <div className="space-y-1">
                          <div className="text-5xl font-black text-white font-display leading-none tracking-tight">{stats.total}</div>
                          <div className="text-blue-50 font-bold text-sm tracking-wide">Total Trips</div>
                          <div className="pt-3 mt-3 border-t border-white/20">
                            <p className="text-xs text-blue-100 font-medium">Lifetime journey count</p>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Finalized Trips */}
                <div className="group">
                  <div className="relative h-full bg-gradient-to-br from-green-50 to-emerald-50 rounded-2xl p-5 border-2 border-green-200 hover:border-green-300 hover:shadow-lg hover:-translate-y-0.5 transition-all duration-300 overflow-hidden">
                    <div className="absolute top-0 right-0 w-24 h-24 bg-green-200/30 rounded-full blur-3xl"></div>
                    <div className="relative z-10">
                      <div className="flex items-center justify-between mb-4">
                        <div className="w-12 h-12 bg-gradient-to-br from-green-500 to-emerald-600 rounded-xl flex items-center justify-center shadow-lg shadow-green-500/30">
                          <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M5 13l4 4L19 7" />
                          </svg>
                        </div>
                        <div className="px-2.5 py-1 bg-green-100 rounded-full">
                          <span className="text-xs font-bold text-green-700">
                            {stats.total > 0 ? Math.round((stats.finalized / stats.total) * 100) : 0}%
                          </span>
                        </div>
                      </div>

                      <div className="text-4xl font-black text-gray-900 font-display mb-1 leading-none">{stats.finalized}</div>
                      <div className="text-xs font-bold text-green-700 mb-3">Finalized Plans</div>

                      <div className="h-1.5 bg-green-100 rounded-full overflow-hidden">
                        <div
                          className="h-full bg-gradient-to-r from-green-500 to-emerald-500 rounded-full transition-all duration-1000 ease-out"
                          style={{width: `${stats.total > 0 ? (stats.finalized / stats.total) * 100 : 0}%`}}
                        ></div>
                      </div>
                    </div>
                  </div>
                </div>

                {/* AI Generated */}
                <div className="group">
                  <div className="relative h-full bg-gradient-to-br from-purple-50 to-pink-50 rounded-2xl p-5 border-2 border-purple-200 hover:border-purple-300 hover:shadow-lg hover:-translate-y-0.5 transition-all duration-300 overflow-hidden">
                    <div className="absolute top-0 right-0 w-24 h-24 bg-purple-200/30 rounded-full blur-3xl"></div>
                    <div className="relative z-10">
                      <div className="flex items-center justify-between mb-4">
                        <div className="w-12 h-12 bg-gradient-to-br from-purple-500 to-pink-600 rounded-xl flex items-center justify-center shadow-lg shadow-purple-500/30">
                          <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M13 10V3L4 14h7v7l9-11h-7z" />
                          </svg>
                        </div>
                        <div className="px-2.5 py-1 bg-purple-100 rounded-full">
                          <span className="text-xs font-bold text-purple-700">
                            {stats.total > 0 ? Math.round((stats.generated / stats.total) * 100) : 0}%
                          </span>
                        </div>
                      </div>

                      <div className="text-4xl font-black text-gray-900 font-display mb-1 leading-none">{stats.generated}</div>
                      <div className="text-xs font-bold text-purple-700 mb-3">AI Generated</div>

                      <div className="h-1.5 bg-purple-100 rounded-full overflow-hidden">
                        <div
                          className="h-full bg-gradient-to-r from-purple-500 to-pink-500 rounded-full transition-all duration-1000 ease-out"
                          style={{width: `${stats.total > 0 ? (stats.generated / stats.total) * 100 : 0}%`}}
                        ></div>
                      </div>
                    </div>
                  </div>
                </div>

                {/* In Progress */}
                <div className="group">
                  <div className="relative h-full bg-gradient-to-br from-amber-50 to-orange-50 rounded-2xl p-5 border-2 border-amber-200 hover:border-amber-300 hover:shadow-lg hover:-translate-y-0.5 transition-all duration-300 overflow-hidden">
                    <div className="absolute top-0 right-0 w-24 h-24 bg-amber-200/30 rounded-full blur-3xl"></div>
                    <div className="relative z-10">
                      <div className="flex items-center justify-between mb-4">
                        <div className="w-12 h-12 bg-gradient-to-br from-amber-500 to-orange-600 rounded-xl flex items-center justify-center shadow-lg shadow-amber-500/30">
                          <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                          </svg>
                        </div>
                        <div className="px-2.5 py-1 bg-amber-100 rounded-full">
                          <span className="text-xs font-bold text-amber-700">
                            {stats.total > 0 ? Math.round((stats.draft / stats.total) * 100) : 0}%
                          </span>
                        </div>
                      </div>

                      <div className="text-4xl font-black text-gray-900 font-display mb-1 leading-none">{stats.draft}</div>
                      <div className="text-xs font-bold text-amber-700 mb-3">In Progress</div>

                      <div className="h-1.5 bg-amber-100 rounded-full overflow-hidden">
                        <div
                          className="h-full bg-gradient-to-r from-amber-500 to-orange-500 rounded-full transition-all duration-1000 ease-out"
                          style={{width: `${stats.total > 0 ? (stats.draft / stats.total) * 100 : 0}%`}}
                        ></div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Trips Section */}
            <div className="mb-8">
              <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-8">
                <div className="flex items-center gap-4">
                  <div className="w-2 h-12 bg-gradient-to-b from-blue-600 via-purple-600 to-pink-600 rounded-full"></div>
                  <div>
                    <h2 className="text-3xl font-black text-gray-900 font-display flex items-center gap-3">
                      Your Trips
                      <span className="inline-flex items-center justify-center min-w-[2.5rem] h-10 px-3 bg-gradient-to-r from-blue-600 to-cyan-500 text-white rounded-xl text-base font-black shadow-lg shadow-blue-500/30">
                        {plans.length}
                      </span>
                    </h2>
                    <p className="text-sm text-gray-600 mt-1">Manage and organize your travel plans</p>
                  </div>
                </div>

                <div className="flex gap-3">
                  <button className="px-5 py-2.5 text-sm font-bold text-gray-700 bg-white border-2 border-gray-200 rounded-xl hover:border-gray-300 hover:shadow-lg transition-all flex items-center gap-2">
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 4a1 1 0 011-1h16a1 1 0 011 1v2.586a1 1 0 01-.293.707l-6.414 6.414a1 1 0 00-.293.707V17l-4 4v-6.586a1 1 0 00-.293-.707L3.293 7.293A1 1 0 013 6.586V4z" />
                    </svg>
                    Filter
                  </button>
                  <button className="px-5 py-2.5 text-sm font-bold text-gray-700 bg-white border-2 border-gray-200 rounded-xl hover:border-gray-300 hover:shadow-lg transition-all flex items-center gap-2">
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 16V4m0 0L3 8m4-4l4 4m6 0v12m0 0l4-4m-4 4l-4-4" />
                    </svg>
                    Sort
                  </button>
                </div>
              </div>

              <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
                {plans.map((plan) => (
                  <PlanCard
                    key={plan.id}
                    plan={plan}
                    onDelete={handleDeleteClick}
                  />
                ))}
              </div>
            </div>
          </>
        )}
      </div>

      <Modal
        isOpen={deleteModalOpen}
        onClose={() => setDeleteModalOpen(false)}
        title="Delete Travel Plan"
        footer={
          <div className="flex space-x-3">
            <Button
              variant="danger"
              onClick={handleDeleteConfirm}
              disabled={deleting}
            >
              {deleting ? 'Deleting...' : 'Delete'}
            </Button>
            <Button
              variant="secondary"
              onClick={() => setDeleteModalOpen(false)}
              disabled={deleting}
            >
              Cancel
            </Button>
          </div>
        }
      >
        <p className="text-sm text-gray-500">
          Are you sure you want to delete this travel plan? This action cannot
          be undone and all itinerary data will be permanently removed.
        </p>
      </Modal>
    </AppLayout>
  );
}
