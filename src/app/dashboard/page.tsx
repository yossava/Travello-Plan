'use client';

import { useSession } from 'next-auth/react';
import { useState, useEffect } from 'react';
import Link from 'next/link';
import toast from 'react-hot-toast';
import AppLayout from '@/components/layout/AppLayout';
import PageHeader from '@/components/layout/PageHeader';
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

  return (
    <AppLayout>
      <div className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
        <div className="px-4 py-6 sm:px-0">
          <PageHeader
            title={`Welcome, ${session?.user?.name}!`}
            description="Manage your travel plans and create new adventures"
            action={
              <Link href="/plan/new">
                <Button>
                  <svg
                    className="mr-2 -ml-1 h-5 w-5"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M12 4v16m8-8H4"
                    />
                  </svg>
                  Create New Trip
                </Button>
              </Link>
            }
          />

          {plans.length === 0 ? (
            <EmptyState />
          ) : (
            <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {plans.map((plan) => (
                <PlanCard
                  key={plan.id}
                  plan={plan}
                  onDelete={handleDeleteClick}
                />
              ))}
            </div>
          )}
        </div>
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
