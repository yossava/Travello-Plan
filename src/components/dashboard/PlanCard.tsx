import Link from 'next/link';
import Badge from '@/components/ui/Badge';
import Card from '@/components/ui/Card';

interface PlanCardProps {
  plan: {
    id: string;
    planName: string;
    destination: {
      country: string;
      city: string;
    };
    departureDate: Date;
    returnDate: Date;
    duration: number;
    status: string;
  };
  onDelete: (id: string) => void;
}

export default function PlanCard({ plan, onDelete }: PlanCardProps) {
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

  const formatDate = (date: Date) => {
    return new Date(date).toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric',
    });
  };

  return (
    <Card className="hover:shadow-lg transition-shadow">
      <div className="p-6">
        <div className="flex justify-between items-start mb-4">
          <div>
            <h3 className="text-lg font-semibold text-gray-900 mb-1">
              {plan.planName}
            </h3>
            <p className="text-sm text-gray-600">
              {plan.destination.city}, {plan.destination.country}
            </p>
          </div>
          <Badge variant={getStatusVariant(plan.status)}>
            {plan.status.charAt(0).toUpperCase() + plan.status.slice(1)}
          </Badge>
        </div>

        <div className="space-y-2 mb-4">
          <div className="flex items-center text-sm text-gray-600">
            <svg
              className="w-4 h-4 mr-2"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"
              />
            </svg>
            <span>
              {formatDate(plan.departureDate)} - {formatDate(plan.returnDate)}
            </span>
          </div>
          <div className="flex items-center text-sm text-gray-600">
            <svg
              className="w-4 h-4 mr-2"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
              />
            </svg>
            <span>{plan.duration} days</span>
          </div>
        </div>

        <div className="flex space-x-2">
          <Link
            href={`/plan/${plan.id}`}
            className="flex-1 inline-flex justify-center items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-primary-600 hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500"
          >
            {plan.status === 'draft' ? 'Continue Planning' : 'View Plan'}
          </Link>
          <button
            onClick={() => onDelete(plan.id)}
            className="inline-flex items-center px-3 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500"
            title="Delete plan"
          >
            <svg
              className="w-5 h-5"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
              />
            </svg>
          </button>
        </div>
      </div>
    </Card>
  );
}
