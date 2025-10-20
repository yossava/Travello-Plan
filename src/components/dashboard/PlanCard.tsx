import Link from 'next/link';
import Badge from '@/components/ui/Badge';

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

  const getStatusConfig = (status: string) => {
    switch (status) {
      case 'finalized':
        return {
          bg: 'bg-gradient-to-br from-green-50 to-emerald-50',
          border: 'border-green-200',
          hoverBorder: 'group-hover:border-green-300',
          accent: 'bg-gradient-to-br from-green-500 to-emerald-600',
          shadow: 'shadow-green-500/20',
        };
      case 'generated':
        return {
          bg: 'bg-gradient-to-br from-blue-50 to-cyan-50',
          border: 'border-blue-200',
          hoverBorder: 'group-hover:border-blue-300',
          accent: 'bg-gradient-to-br from-blue-500 to-cyan-600',
          shadow: 'shadow-blue-500/20',
        };
      default:
        return {
          bg: 'bg-gradient-to-br from-gray-50 to-slate-50',
          border: 'border-gray-200',
          hoverBorder: 'group-hover:border-gray-300',
          accent: 'bg-gradient-to-br from-gray-600 to-gray-800',
          shadow: 'shadow-gray-500/20',
        };
    }
  };

  const formatDate = (date: Date) => {
    return new Date(date).toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric',
    });
  };

  const statusConfig = getStatusConfig(plan.status);

  return (
    <div className="group relative">
      <div className={`relative bg-white border-2 ${statusConfig.border} ${statusConfig.hoverBorder} rounded-2xl overflow-hidden hover:shadow-2xl hover:-translate-y-1 transition-all duration-300`}>
        <div className="p-6">
          {/* Header */}
          <div className="flex justify-between items-start mb-5">
            <div className="flex-1">
              <h3 className="text-xl font-black text-gray-900 mb-2 group-hover:bg-gradient-to-r group-hover:from-blue-600 group-hover:to-cyan-500 group-hover:bg-clip-text group-hover:text-transparent transition-all duration-300 font-display leading-tight">
                {plan.planName}
              </h3>
              <div className="flex items-center gap-2 text-gray-600">
                <div className={`w-8 h-8 ${statusConfig.accent} rounded-lg flex items-center justify-center ${statusConfig.shadow} shadow-md`}>
                  <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                  </svg>
                </div>
                <span className="text-sm font-bold text-gray-700">
                  {plan.destination.city}, {plan.destination.country}
                </span>
              </div>
            </div>
            <Badge variant={getStatusVariant(plan.status)}>
              {plan.status.charAt(0).toUpperCase() + plan.status.slice(1)}
            </Badge>
          </div>

          {/* Details Section */}
          <div className={`${statusConfig.bg} rounded-xl p-4 mb-5 border ${statusConfig.border}`}>
            <div className="space-y-3">
              <div className="flex items-center gap-3 text-sm text-gray-700">
                <div className="flex items-center justify-center w-9 h-9 rounded-lg bg-white shadow-sm border border-gray-200">
                  <svg className="w-4 h-4 text-gray-700" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                  </svg>
                </div>
                <div>
                  <div className="text-xs font-semibold text-gray-500 uppercase tracking-wide mb-0.5">Travel Dates</div>
                  <div className="font-bold text-gray-900">
                    {formatDate(plan.departureDate)} - {formatDate(plan.returnDate)}
                  </div>
                </div>
              </div>

              <div className="flex items-center gap-3 text-sm text-gray-700">
                <div className="flex items-center justify-center w-9 h-9 rounded-lg bg-white shadow-sm border border-gray-200">
                  <svg className="w-4 h-4 text-gray-700" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                </div>
                <div>
                  <div className="text-xs font-semibold text-gray-500 uppercase tracking-wide mb-0.5">Duration</div>
                  <div className="font-bold text-gray-900">{plan.duration} days</div>
                </div>
              </div>
            </div>
          </div>

          {/* Actions */}
          <div className="flex gap-3">
            <Link href={`/plan/${plan.id}`} className="flex-1">
              <button className="w-full relative px-6 py-3 bg-gradient-to-r from-blue-600 to-cyan-500 text-white rounded-xl font-bold text-sm hover:shadow-xl hover:shadow-blue-500/40 hover:scale-[1.02] transition-all duration-300 overflow-hidden group/btn">
                <div className="absolute inset-0 bg-gradient-to-r from-cyan-500 to-blue-600 opacity-0 group-hover/btn:opacity-100 transition-opacity duration-300"></div>
                <span className="relative z-10 flex items-center justify-center gap-2">
                  {plan.status === 'draft' ? 'Continue Planning' : 'View Plan'}
                  <svg className="w-4 h-4 group-hover/btn:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M9 5l7 7-7 7" />
                  </svg>
                </span>
              </button>
            </Link>
            <button
              onClick={() => onDelete(plan.id)}
              className="inline-flex items-center justify-center px-4 py-3 border-2 border-gray-200 text-sm font-bold rounded-xl text-gray-600 bg-white hover:bg-red-50 hover:border-red-300 hover:text-red-600 focus:outline-none focus:ring-2 focus:ring-red-500/50 hover:scale-105 transition-all duration-300"
              title="Delete plan"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
              </svg>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
