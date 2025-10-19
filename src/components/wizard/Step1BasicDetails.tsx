import Input from '@/components/ui/Input';
import Select from '@/components/ui/Select';
import { CURRENCIES } from '@/types/plan';

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
    <div className="space-y-6">
      <div>
        <h2 className="text-lg font-medium text-gray-900 mb-4">
          Basic Trip Details
        </h2>
        <p className="text-sm text-gray-600 mb-6">
          Tell us about your travel plans
        </p>
      </div>

      {/* Origin */}
      <div>
        <h3 className="text-sm font-medium text-gray-700 mb-3">Origin</h3>
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          <Input
            id="originCountry"
            label="Country"
            value={formData.origin.country}
            onChange={(e) =>
              onChange('origin', {
                ...formData.origin,
                country: e.target.value,
              })
            }
            error={errors.originCountry}
            required
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
        <h3 className="text-sm font-medium text-gray-700 mb-3">Destination</h3>
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          <Input
            id="destCountry"
            label="Country"
            value={formData.destination.country}
            onChange={(e) =>
              onChange('destination', {
                ...formData.destination,
                country: e.target.value,
              })
            }
            error={errors.destCountry}
            required
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
        <h3 className="text-sm font-medium text-gray-700 mb-3">
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
          <p className="mt-2 text-sm text-gray-600">
            Duration: {calculateDuration()} days
          </p>
        )}
      </div>

      {/* Travelers */}
      <div>
        <h3 className="text-sm font-medium text-gray-700 mb-3">Travelers</h3>
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
        <h3 className="text-sm font-medium text-gray-700 mb-3">Budget</h3>
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
