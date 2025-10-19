interface Accommodation {
  name: string;
  type: string;
  address: string;
  checkIn: string;
  checkOut: string;
  nights: number;
  pricePerNight: number;
  totalCost: number;
  amenities: string[];
  proximityToAttractions?: string;
  whyRecommended?: string;
}

interface AccommodationSectionProps {
  accommodation: {
    primary: Accommodation;
    alternatives?: Accommodation[];
  };
  currency: string;
}

export default function AccommodationSection({
  accommodation,
  currency,
}: AccommodationSectionProps) {
  const AccommodationCard = ({
    hotel,
    isPrimary = false,
  }: {
    hotel: Accommodation;
    isPrimary?: boolean;
  }) => (
    <div
      className={`bg-white rounded-lg shadow p-6 ${
        isPrimary ? 'border-2 border-primary-500' : ''
      }`}
    >
      {isPrimary && (
        <div className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-primary-100 text-primary-800 mb-3">
          <svg
            className="w-4 h-4 mr-1"
            fill="currentColor"
            viewBox="0 0 20 20"
          >
            <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
          </svg>
          Recommended
        </div>
      )}

      <div className="flex justify-between items-start mb-4">
        <div>
          <h3 className="text-lg font-semibold text-gray-900">{hotel.name}</h3>
          <p className="text-sm text-gray-600">{hotel.type}</p>
        </div>
        <div className="text-right">
          <div className="text-2xl font-bold text-primary-600">
            {currency} {hotel.totalCost.toLocaleString()}
          </div>
          <div className="text-sm text-gray-500">
            {currency} {hotel.pricePerNight.toLocaleString()}/night
          </div>
        </div>
      </div>

      <div className="space-y-3 mb-4">
        <div className="flex items-start">
          <svg
            className="w-5 h-5 text-gray-400 mr-2 flex-shrink-0 mt-0.5"
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
          <div className="text-sm text-gray-700">{hotel.address}</div>
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div className="flex items-center text-sm">
            <svg
              className="w-5 h-5 text-gray-400 mr-2"
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
            <div>
              <div className="text-gray-500">Check-in</div>
              <div className="font-medium text-gray-900">
                {new Date(hotel.checkIn).toLocaleDateString()}
              </div>
            </div>
          </div>
          <div className="flex items-center text-sm">
            <svg
              className="w-5 h-5 text-gray-400 mr-2"
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
            <div>
              <div className="text-gray-500">Check-out</div>
              <div className="font-medium text-gray-900">
                {new Date(hotel.checkOut).toLocaleDateString()}
              </div>
            </div>
          </div>
        </div>

        <div className="text-sm text-gray-600">
          <span className="font-medium">{hotel.nights}</span> night
          {hotel.nights > 1 ? 's' : ''}
        </div>
      </div>

      {/* Amenities */}
      {hotel.amenities && hotel.amenities.length > 0 && (
        <div className="mb-4">
          <h4 className="text-sm font-medium text-gray-700 mb-2">Amenities</h4>
          <div className="flex flex-wrap gap-2">
            {hotel.amenities.map((amenity, idx) => (
              <span
                key={idx}
                className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-gray-100 text-gray-800"
              >
                {amenity}
              </span>
            ))}
          </div>
        </div>
      )}

      {/* Proximity */}
      {hotel.proximityToAttractions && (
        <div className="mb-4 text-sm text-gray-600">
          <span className="font-medium">Location: </span>
          {hotel.proximityToAttractions}
        </div>
      )}

      {/* Why Recommended */}
      {hotel.whyRecommended && (
        <div className="bg-green-50 border border-green-200 rounded p-3">
          <div className="flex">
            <svg
              className="w-5 h-5 text-green-400 mr-2 flex-shrink-0"
              fill="currentColor"
              viewBox="0 0 20 20"
            >
              <path
                fillRule="evenodd"
                d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                clipRule="evenodd"
              />
            </svg>
            <div>
              <div className="text-sm font-medium text-green-800 mb-1">
                Why We Recommend This
              </div>
              <p className="text-sm text-green-700">{hotel.whyRecommended}</p>
            </div>
          </div>
        </div>
      )}
    </div>
  );

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-xl font-semibold text-gray-900 mb-4">
          Recommended Accommodation
        </h2>
        <AccommodationCard hotel={accommodation.primary} isPrimary />
      </div>

      {accommodation.alternatives && accommodation.alternatives.length > 0 && (
        <div>
          <h2 className="text-xl font-semibold text-gray-900 mb-4">
            Alternative Options
          </h2>
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {accommodation.alternatives.map((hotel, idx) => (
              <AccommodationCard key={idx} hotel={hotel} />
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
