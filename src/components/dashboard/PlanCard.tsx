import Link from 'next/link';
import Badge from '@/components/ui/Badge';
import Card from '@/components/ui/Card';
import Button from '@/components/ui/Button';

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
    <Card className="hover:scale-[1.02] group">
      <div className="p-6">
        <div className="flex justify-between items-start mb-4">
          <div className="flex-1">
            <h3 className="text-xl font-bold text-white mb-2 group-hover:text-purple-300 transition-colors">
              {plan.planName}
            </h3>
            <div className="flex items-center text-gray-300">
              <svg className="w-4 h-4 mr-2 text-purple-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
              </svg>
              <span className="text-sm">
                {plan.destination.city}, {plan.destination.country}
              </span>
            </div>
          </div>
          <Badge variant={getStatusVariant(plan.status)}>
            {plan.status.charAt(0).toUpperCase() + plan.status.slice(1)}
          </Badge>
        </div>

        <div className="space-y-3 mb-6">
          <div className="flex items-center text-sm text-gray-300">
            <div className="flex items-center justify-center w-8 h-8 rounded-lg bg-purple-500/20 mr-3">
              <svg className="w-4 h-4 text-purple-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
              </svg>
            </div>
            <span>
              {formatDate(plan.departureDate)} - {formatDate(plan.returnDate)}
            </span>
          </div>
          <div className="flex items-center text-sm text-gray-300">
            <div className="flex items-center justify-center w-8 h-8 rounded-lg bg-pink-500/20 mr-3">
              <svg className="w-4 h-4 text-pink-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
            <span>{plan.duration} days</span>
          </div>
        </div>

        <div className="flex space-x-3">
          <Link href={`/plan/${plan.id}`} className="flex-1">
            <Button variant="gradient" size="md" fullWidth>
              {plan.status === 'draft' ? 'Continue Planning' : 'View Plan'}
            </Button>
          </Link>
          <button
            onClick={() => onDelete(plan.id)}
            className="inline-flex items-center justify-center px-4 py-2.5 border-2 border-white/10 text-sm font-medium rounded-xl text-gray-300 bg-white/5 hover:bg-red-500/20 hover:border-red-500/50 hover:text-red-300 focus:outline-none focus:ring-4 focus:ring-red-500/50 transition-all duration-300"
            title="Delete plan"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
            </svg>
          </button>
        </div>
      </div>
    </Card>
  );
}
