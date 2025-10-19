import Button from '@/components/ui/Button';
import { TravelPlanFormData } from '@/types/plan';

interface Step3Props {
  formData: TravelPlanFormData;
  onEdit: (step: number) => void;
  onGenerate: () => void;
  onSaveDraft: () => void;
  generating: boolean;
}

export default function Step3Review({
  formData,
  onEdit,
  onGenerate,
  onSaveDraft,
  generating,
}: Step3Props) {
  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    });
  };

  const totalTravelers =
    formData.travelers.adults +
    formData.travelers.children +
    formData.travelers.infants;

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-lg font-medium text-gray-900 mb-4">
          Review Your Trip Details
        </h2>
        <p className="text-sm text-gray-600 mb-6">
          Please review your information before generating your personalized
          itinerary
        </p>
      </div>

      {/* Trip Details */}
      <div className="bg-gray-50 rounded-lg p-4">
        <div className="flex justify-between items-start mb-4">
          <h3 className="text-md font-semibold text-gray-900">Trip Details</h3>
          <Button variant="secondary" size="sm" onClick={() => onEdit(1)}>
            Edit
          </Button>
        </div>
        <dl className="grid grid-cols-1 gap-x-4 gap-y-3 sm:grid-cols-2">
          <div>
            <dt className="text-sm font-medium text-gray-500">Origin</dt>
            <dd className="mt-1 text-sm text-gray-900">
              {formData.origin.city}, {formData.origin.country}
            </dd>
          </div>
          <div>
            <dt className="text-sm font-medium text-gray-500">Destination</dt>
            <dd className="mt-1 text-sm text-gray-900">
              {formData.destination.city}, {formData.destination.country}
            </dd>
          </div>
          <div>
            <dt className="text-sm font-medium text-gray-500">Departure</dt>
            <dd className="mt-1 text-sm text-gray-900">
              {formatDate(formData.departureDate)}
            </dd>
          </div>
          <div>
            <dt className="text-sm font-medium text-gray-500">Return</dt>
            <dd className="mt-1 text-sm text-gray-900">
              {formatDate(formData.returnDate)}
            </dd>
          </div>
          <div>
            <dt className="text-sm font-medium text-gray-500">Duration</dt>
            <dd className="mt-1 text-sm text-gray-900">
              {formData.duration} days
            </dd>
          </div>
          <div>
            <dt className="text-sm font-medium text-gray-500">Travelers</dt>
            <dd className="mt-1 text-sm text-gray-900">
              {totalTravelers} person{totalTravelers > 1 ? 's' : ''} (
              {formData.travelers.adults} adult{formData.travelers.adults > 1 ? 's' : ''}
              {formData.travelers.children > 0 && `, ${formData.travelers.children} child${formData.travelers.children > 1 ? 'ren' : ''}`}
              {formData.travelers.infants > 0 && `, ${formData.travelers.infants} infant${formData.travelers.infants > 1 ? 's' : ''}`}
              )
            </dd>
          </div>
          <div className="sm:col-span-2">
            <dt className="text-sm font-medium text-gray-500">Budget</dt>
            <dd className="mt-1 text-sm text-gray-900">
              {formData.budget.currency} {formData.budget.min.toLocaleString()}{' '}
              - {formData.budget.max.toLocaleString()}
            </dd>
          </div>
        </dl>
      </div>

      {/* Preferences */}
      <div className="bg-gray-50 rounded-lg p-4">
        <div className="flex justify-between items-start mb-4">
          <h3 className="text-md font-semibold text-gray-900">Preferences</h3>
          <Button variant="secondary" size="sm" onClick={() => onEdit(2)}>
            Edit
          </Button>
        </div>
        <dl className="grid grid-cols-1 gap-x-4 gap-y-3 sm:grid-cols-2">
          <div>
            <dt className="text-sm font-medium text-gray-500">Trip Purpose</dt>
            <dd className="mt-1 text-sm text-gray-900">
              {formData.preferences.tripPurpose}
            </dd>
          </div>
          <div>
            <dt className="text-sm font-medium text-gray-500">Travel Pace</dt>
            <dd className="mt-1 text-sm text-gray-900">
              {formData.preferences.travelPace}
            </dd>
          </div>
          <div className="sm:col-span-2">
            <dt className="text-sm font-medium text-gray-500">
              Accommodation Types
            </dt>
            <dd className="mt-1 text-sm text-gray-900">
              {formData.preferences.accommodationTypes.join(', ')}
            </dd>
          </div>
          <div className="sm:col-span-2">
            <dt className="text-sm font-medium text-gray-500">
              Interests & Activities
            </dt>
            <dd className="mt-1 text-sm text-gray-900">
              {formData.preferences.interests.join(', ')}
            </dd>
          </div>
          {formData.preferences.dietaryRestrictions.length > 0 && (
            <div className="sm:col-span-2">
              <dt className="text-sm font-medium text-gray-500">
                Dietary Restrictions
              </dt>
              <dd className="mt-1 text-sm text-gray-900">
                {formData.preferences.dietaryRestrictions.join(', ')}
              </dd>
            </div>
          )}
          {formData.preferences.mustVisitPlaces && (
            <div className="sm:col-span-2">
              <dt className="text-sm font-medium text-gray-500">
                Must-Visit Places
              </dt>
              <dd className="mt-1 text-sm text-gray-900">
                {formData.preferences.mustVisitPlaces}
              </dd>
            </div>
          )}
          {formData.preferences.specialRequirements && (
            <div className="sm:col-span-2">
              <dt className="text-sm font-medium text-gray-500">
                Special Requirements
              </dt>
              <dd className="mt-1 text-sm text-gray-900">
                {formData.preferences.specialRequirements}
              </dd>
            </div>
          )}
        </dl>
      </div>

      {/* Actions */}
      <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
        <div className="flex">
          <div className="flex-shrink-0">
            <svg
              className="h-5 w-5 text-blue-400"
              fill="currentColor"
              viewBox="0 0 20 20"
            >
              <path
                fillRule="evenodd"
                d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z"
                clipRule="evenodd"
              />
            </svg>
          </div>
          <div className="ml-3 flex-1">
            <p className="text-sm text-blue-700">
              Generating your personalized itinerary typically takes 20-30
              seconds. You can save this as a draft and come back later, or
              generate it now!
            </p>
          </div>
        </div>
      </div>

      <div className="flex space-x-4">
        <Button
          variant="secondary"
          onClick={onSaveDraft}
          disabled={generating}
          className="flex-1"
        >
          Save as Draft
        </Button>
        <Button
          onClick={onGenerate}
          disabled={generating}
          className="flex-1"
          size="lg"
        >
          {generating ? 'Generating...' : 'Generate My Travel Plan'}
        </Button>
      </div>
    </div>
  );
}
