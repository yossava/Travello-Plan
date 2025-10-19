import Input from '@/components/ui/Input';
import Select from '@/components/ui/Select';
import SearchableSelect from '@/components/ui/SearchableSelect';
import { CURRENCIES, COUNTRIES } from '@/types/plan';

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

  const calculateDuration = () => {
    if (formData.departureDate && formData.returnDate) {
      const departure = new Date(formData.departureDate);
      const returnDate = new Date(formData.returnDate);
      const diff = returnDate.getTime() - departure.getTime();
      return Math.ceil(diff / (1000 * 60 * 60 * 24));
    }
    return 0;
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
          <Input
            id="destCity"
            label="City"
            value={formData.destination.city}
            onChange={(e) =>
              onChange('destination', {
                ...formData.destination,
                city: e.target.value,
              })
            }
            error={errors.destCity}
            required
          />
        </div>
      </div>

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
            type="number"
            value={formData.budget.min}
            onChange={(e) =>
              onChange('budget', {
                ...formData.budget,
                min: parseFloat(e.target.value) || 0,
              })
            }
            min={0}
            error={errors.minBudget}
            required
          />
          <Input
            id="maxBudget"
            label="Maximum Budget"
            type="number"
            value={formData.budget.max}
            onChange={(e) =>
              onChange('budget', {
                ...formData.budget,
                max: parseFloat(e.target.value) || 0,
              })
            }
            min={formData.budget.min || 0}
            error={errors.maxBudget}
            required
          />
        </div>
      </div>
    </div>
  );
}
