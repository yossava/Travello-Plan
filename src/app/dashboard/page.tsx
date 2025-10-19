'use client';

import { useSession } from 'next-auth/react';
import AppLayout from '@/components/layout/AppLayout';
import Spinner from '@/components/ui/Spinner';

export default function DashboardPage() {
  const { data: session, status } = useSession();

  if (status === 'loading') {
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
          <div className="mb-6">
            <h2 className="text-2xl font-bold text-gray-900">
              Welcome, {session?.user?.name}!
            </h2>
            <p className="mt-1 text-sm text-gray-600">
              Start planning your next adventure
            </p>
          </div>

          <div className="bg-white overflow-hidden shadow rounded-lg">
            <div className="px-4 py-5 sm:p-6">
              <div className="text-center py-12">
                <h3 className="text-lg font-medium text-gray-900 mb-4">
                  No travel plans yet
                </h3>
                <p className="text-gray-600 mb-6">
                  Create your first travel plan to get started
                </p>
                <button className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-primary-600 hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500">
                  Create New Trip
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </AppLayout>
  );
}
