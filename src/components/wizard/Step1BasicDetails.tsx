import { useState } from 'react';
import Input from '@/components/ui/Input';
import Select from '@/components/ui/Select';
import SearchableSelect from '@/components/ui/SearchableSelect';
import Button from '@/components/ui/Button';
import Modal from '@/components/ui/Modal';
import { CURRENCIES, COUNTRIES } from '@/types/plan';
import toast from 'react-hot-toast';

interface Step1Props {
  formData: {
    origin: { country: string; city: string };
    destination: { country: string; city: string };
    departureDate: string;
    returnDate: string;
    travelers: { adults: number; children: number; infants: number };
    budget: { currency: string; min: number; max: number };
  };
  errors: Record<string, string>;
  onChange: (field: string, value: unknown) => void;
}

export default function Step1BasicDetails({
  formData,
  errors,
  onChange,
}: Step1Props) {
  const today = new Date().toISOString().split('T')[0];
  const [loadingSuggestions, setLoadingSuggestions] = useState(false);
  const [citySuggestions, setCitySuggestions] = useState<
    Array<{ name: string; description: string }>
  >([]);
  const [showSuggestionsModal, setShowSuggestionsModal] = useState(false);

  const calculateDuration = () => {
    if (formData.departureDate && formData.returnDate) {
      const departure = new Date(formData.departureDate);
      const returnDate = new Date(formData.returnDate);
      const diff = returnDate.getTime() - departure.getTime();
      return Math.ceil(diff / (1000 * 60 * 60 * 24));
    }
    return 0;
  };

  const handleGetCitySuggestions = async () => {
    if (!formData.destination.country) {
      toast.error('Please select a destination country first');
      return;
    }

    setLoadingSuggestions(true);
    try {
      const response = await fetch('/api/ai/suggest-cities', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ country: formData.destination.country }),
      });

      if (!response.ok) {
        throw new Error('Failed to get city suggestions');
      }

      const data = await response.json();
      setCitySuggestions(data.cities);
      setShowSuggestionsModal(true);
    } catch (error) {
      toast.error('Failed to get city suggestions');
      console.error(error);
    } finally {
      setLoadingSuggestions(false);
    }
  };

  const handleSelectCity = (city: string) => {
    onChange('destination', { ...formData.destination, city });
    setShowSuggestionsModal(false);
    toast.success(`Selected ${city}`);
  };

  return (
    <div className="space-y-8">
      <div>
        <h2 className="text-2xl font-bold text-white mb-2">
          Basic Trip Details
        </h2>
        <p className="text-base text-gray-300">
          Tell us about your travel plans
        </p>
      </div>

      {/* Origin */}
      <div>
        <h3 className="text-lg font-semibold text-white mb-4">Origin</h3>
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          <SearchableSelect
            id="originCountry"
            label="Country"
            value={formData.origin.country}
            onChange={(value) =>
              onChange('origin', {
                ...formData.origin,
                country: value,
              })
            }
            options={COUNTRIES.map((country) => ({
              value: country,
              label: country,
            }))}
            error={errors.originCountry}
            required
            placeholder="Search countries..."
          />
          <Input
            id="originCity"
            label="City"
            value={formData.origin.city}
            onChange={(e) =>
              onChange('origin', { ...formData.origin, city: e.target.value })
            }
            error={errors.originCity}
            required
          />
        </div>
      </div>

      {/* Destination */}
      <div>
        <h3 className="text-lg font-semibold text-white mb-4">Destination</h3>
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          <SearchableSelect
            id="destCountry"
            label="Country"
            value={formData.destination.country}
            onChange={(value) =>
              onChange('destination', {
                ...formData.destination,
                country: value,
              })
            }
            options={COUNTRIES.map((country) => ({
              value: country,
              label: country,
            }))}
            error={errors.destCountry}
            required
            placeholder="Search countries..."
          />
          <div>
            <label
              htmlFor="destCity"
              className="block text-sm font-medium text-gray-200 mb-2"
            >
              City <span className="text-red-400">*</span>
            </label>
            <div className="flex gap-2">
              <div className="flex-1">
                <Input
                  id="destCity"
                  value={formData.destination.city}
                  onChange={(e) =>
                    onChange('destination', {
                      ...formData.destination,
                      city: e.target.value,
                    })
                  }
                  error={errors.destCity}
                  placeholder="Enter city name"
                />
              </div>
              <Button
                type="button"
                variant="secondary"
                size="md"
                onClick={handleGetCitySuggestions}
                disabled={!formData.destination.country || loadingSuggestions}
                loading={loadingSuggestions}
                className="whitespace-nowrap bg-white/10 hover:bg-white/20 text-white border-2 border-white/30 hover:border-white/50"
              >
                <svg
                  className="w-4 h-4"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z"
                  />
                </svg>
                AI Suggest
              </Button>
            </div>
          </div>
        </div>
      </div>

      {/* City Suggestions Modal */}
      <Modal
        isOpen={showSuggestionsModal}
        onClose={() => setShowSuggestionsModal(false)}
        title={`Popular Cities in ${formData.destination.country}`}
      >
        <div className="space-y-2">
          <p className="text-sm text-gray-400 mb-4">
            Select a city or close this dialog to enter your own
          </p>
          <div className="grid grid-cols-1 gap-3">
            {citySuggestions.map((city) => (
              <button
                key={city.name}
                onClick={() => handleSelectCity(city.name)}
                className="text-left px-4 py-4 bg-white/5 hover:bg-white/10 rounded-lg transition-all duration-200 border border-white/10 hover:border-primary-500 hover:shadow-lg group"
              >
                <div className="flex items-start gap-3">
                  <div className="flex-shrink-0 mt-0.5">
                    <svg
                      className="w-5 h-5 text-primary-400 group-hover:text-primary-300"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"
                      />
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"
                      />
                    </svg>
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="font-semibold text-white mb-1 group-hover:text-primary-300 transition-colors">
                      {city.name}
                    </div>
                    <div className="text-sm text-gray-400 leading-relaxed">
                      {city.description}
                    </div>
                  </div>
                  <div className="flex-shrink-0">
                    <svg
                      className="w-5 h-5 text-gray-500 group-hover:text-primary-400 transition-colors"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M9 5l7 7-7 7"
                      />
                    </svg>
                  </div>
                </div>
              </button>
            ))}
          </div>
        </div>
      </Modal>

      {/* Dates */}
      <div>
        <h3 className="text-lg font-semibold text-white mb-4">
          Travel Dates
        </h3>
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          <Input
            id="departureDate"
            label="Departure Date"
            type="date"
            value={formData.departureDate}
            onChange={(e) => onChange('departureDate', e.target.value)}
            min={today}
            error={errors.departureDate}
            required
          />
          <Input
            id="returnDate"
            label="Return Date"
            type="date"
            value={formData.returnDate}
            onChange={(e) => onChange('returnDate', e.target.value)}
            min={formData.departureDate || today}
            error={errors.returnDate}
            required
          />
        </div>
        {calculateDuration() > 0 && (
          <div className="mt-3 flex items-center">
            <div className="inline-flex items-center px-4 py-2 bg-purple-500/20 border border-purple-500/30 rounded-xl">
              <svg className="w-5 h-5 text-purple-400 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
              </svg>
              <span className="text-sm font-semibold text-purple-300">
                Duration: {calculateDuration()} days
              </span>
            </div>
          </div>
        )}
      </div>

      {/* Travelers */}
      <div>
        <h3 className="text-lg font-semibold text-white mb-4">Travelers</h3>
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
          <Input
            id="adults"
            label="Adults"
            type="number"
            value={formData.travelers.adults}
            onChange={(e) =>
              onChange('travelers', {
                ...formData.travelers,
                adults: parseInt(e.target.value) || 0,
              })
            }
            min={1}
            max={10}
            error={errors.adults}
            required
          />
          <Input
            id="children"
            label="Children (2-12)"
            type="number"
            value={formData.travelers.children}
            onChange={(e) =>
              onChange('travelers', {
                ...formData.travelers,
                children: parseInt(e.target.value) || 0,
              })
            }
            min={0}
            max={10}
          />
          <Input
            id="infants"
            label="Infants (0-2)"
            type="number"
            value={formData.travelers.infants}
            onChange={(e) =>
              onChange('travelers', {
                ...formData.travelers,
                infants: parseInt(e.target.value) || 0,
              })
            }
            min={0}
            max={5}
          />
        </div>
      </div>

      {/* Budget */}
      <div>
        <h3 className="text-lg font-semibold text-white mb-4">Budget</h3>
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
          <Select
            id="currency"
            label="Currency"
            value={formData.budget.currency}
            onChange={(e) =>
              onChange('budget', {
                ...formData.budget,
                currency: e.target.value,
              })
            }
            options={CURRENCIES.map((c) => ({
              value: c.code,
              label: `${c.code} (${c.symbol})`,
            }))}
            error={errors.currency}
            required
          />
          <Input
            id="minBudget"
            label="Minimum Budget"
            type="text"
            inputMode="numeric"
            value={formData.budget.min || ''}
            onChange={(e) => {
              const value = e.target.value.replace(/[^0-9]/g, '');
              onChange('budget', {
                ...formData.budget,
                min: value ? parseInt(value, 10) : 0,
              });
            }}
            error={errors.minBudget}
            required
            placeholder="0"
          />
          <Input
            id="maxBudget"
            label="Maximum Budget"
            type="text"
            inputMode="numeric"
            value={formData.budget.max || ''}
            onChange={(e) => {
              const value = e.target.value.replace(/[^0-9]/g, '');
              onChange('budget', {
                ...formData.budget,
                max: value ? parseInt(value, 10) : 0,
              });
            }}
            error={errors.maxBudget}
            required
            placeholder="0"
          />
        </div>
      </div>
    </div>
  );
}
