import Select from '@/components/ui/Select';
import Checkbox from '@/components/ui/Checkbox';
import Textarea from '@/components/ui/Textarea';
import {
  TRIP_PURPOSES,
  ACCOMMODATION_TYPES,
  INTERESTS,
  TRAVEL_PACE,
  DIETARY_RESTRICTIONS,
} from '@/types/plan';

interface Step2Props {
  formData: {
    preferences: {
      tripPurpose: string;
      accommodationTypes: string[];
      interests: string[];
      travelPace: string;
      dietaryRestrictions: string[];
      mustVisitPlaces?: string;
      specialRequirements?: string;
    };
  };
  errors: Record<string, string>;
  onChange: (field: string, value: unknown) => void;
}

export default function Step2Preferences({
  formData,
  errors,
  onChange,
}: Step2Props) {
  const handleCheckboxChange = (
    category: 'accommodationTypes' | 'interests' | 'dietaryRestrictions',
    value: string
  ) => {
    const current = formData.preferences[category];
    const updated = current.includes(value)
      ? current.filter((item) => item !== value)
      : [...current, value];

    onChange('preferences', {
      ...formData.preferences,
      [category]: updated,
    });
  };

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold text-gray-900 mb-2 font-display">
          Travel Preferences
        </h2>
        <p className="text-base text-gray-600 mb-6">
          Help us personalize your itinerary
        </p>
      </div>

      {/* Trip Purpose */}
      <div>
        <Select
          id="tripPurpose"
          label="Trip Purpose"
          value={formData.preferences.tripPurpose}
          onChange={(e) =>
            onChange('preferences', {
              ...formData.preferences,
              tripPurpose: e.target.value,
            })
          }
          options={TRIP_PURPOSES.map((purpose) => ({
            value: purpose,
            label: purpose,
          }))}
          error={errors.tripPurpose}
          required
        />
      </div>

      {/* Accommodation Preferences */}
      <div>
        <label className="block text-sm font-semibold text-gray-700 mb-2">
          Accommodation Preferences <span className="text-red-500">*</span>
        </label>
        <p className="text-xs text-gray-600 mb-3">
          Select at least one accommodation type
        </p>
        <div className="grid grid-cols-2 gap-3 sm:grid-cols-3">
          {ACCOMMODATION_TYPES.map((type) => (
            <Checkbox
              key={type}
              id={`accommodation-${type}`}
              label={type}
              checked={formData.preferences.accommodationTypes.includes(type)}
              onChange={() => handleCheckboxChange('accommodationTypes', type)}
            />
          ))}
        </div>
        {errors.accommodationTypes && (
          <p className="mt-2 text-sm text-red-600 flex items-center">
            <svg className="w-4 h-4 mr-1" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
            </svg>
            {errors.accommodationTypes}
          </p>
        )}
      </div>

      {/* Interests */}
      <div>
        <label className="block text-sm font-semibold text-gray-700 mb-2">
          Interests & Activities <span className="text-red-500">*</span>
        </label>
        <p className="text-xs text-gray-600 mb-3">
          Select at least one interest
        </p>
        <div className="grid grid-cols-2 gap-3 sm:grid-cols-3">
          {INTERESTS.map((interest) => (
            <Checkbox
              key={interest}
              id={`interest-${interest}`}
              label={interest}
              checked={formData.preferences.interests.includes(interest)}
              onChange={() => handleCheckboxChange('interests', interest)}
            />
          ))}
        </div>
        {errors.interests && (
          <p className="mt-2 text-sm text-red-600 flex items-center">
            <svg className="w-4 h-4 mr-1" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
            </svg>
            {errors.interests}
          </p>
        )}
      </div>

      {/* Travel Pace */}
      <div>
        <label className="block text-sm font-semibold text-gray-700 mb-2">
          Travel Pace <span className="text-red-500">*</span>
        </label>
        <div className="space-y-2">
          {TRAVEL_PACE.map((pace) => (
            <div key={pace} className="flex items-center">
              <input
                type="radio"
                id={`pace-${pace}`}
                name="travelPace"
                value={pace}
                checked={formData.preferences.travelPace === pace}
                onChange={(e) =>
                  onChange('preferences', {
                    ...formData.preferences,
                    travelPace: e.target.value,
                  })
                }
                className="h-4 w-4 text-blue-600 focus:ring-blue-500 focus:ring-offset-0 border-gray-300 bg-gray-50"
              />
              <label
                htmlFor={`pace-${pace}`}
                className="ml-2 block text-sm text-gray-900"
              >
                {pace}
              </label>
            </div>
          ))}
        </div>
        {errors.travelPace && (
          <p className="mt-2 text-sm text-red-600 flex items-center">
            <svg className="w-4 h-4 mr-1" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
            </svg>
            {errors.travelPace}
          </p>
        )}
      </div>

      {/* Dietary Restrictions */}
      <div>
        <label className="block text-sm font-semibold text-gray-700 mb-2">
          Dietary Restrictions
        </label>
        <div className="grid grid-cols-2 gap-3 sm:grid-cols-3">
          {DIETARY_RESTRICTIONS.map((restriction) => (
            <Checkbox
              key={restriction}
              id={`dietary-${restriction}`}
              label={restriction}
              checked={formData.preferences.dietaryRestrictions.includes(
                restriction
              )}
              onChange={() =>
                handleCheckboxChange('dietaryRestrictions', restriction)
              }
            />
          ))}
        </div>
      </div>

      {/* Must-Visit Places */}
      <div>
        <Textarea
          id="mustVisitPlaces"
          label="Must-Visit Places (Optional)"
          value={formData.preferences.mustVisitPlaces || ''}
          onChange={(e) =>
            onChange('preferences', {
              ...formData.preferences,
              mustVisitPlaces: e.target.value,
            })
          }
          placeholder="List any specific places, attractions, or restaurants you want to visit..."
        />
      </div>

      {/* Special Requirements */}
      <div>
        <Textarea
          id="specialRequirements"
          label="Special Requirements (Optional)"
          value={formData.preferences.specialRequirements || ''}
          onChange={(e) =>
            onChange('preferences', {
              ...formData.preferences,
              specialRequirements: e.target.value,
            })
          }
          placeholder="Any special needs, accessibility requirements, or other important information..."
        />
      </div>
    </div>
  );
}
