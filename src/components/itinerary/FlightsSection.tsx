interface FlightDetails {
  airline: string;
  flightNumber: string;
  departure: { airport: string; time: string; terminal?: string };
  arrival: { airport: string; time: string; terminal?: string };
  duration: string;
  class: string;
  estimatedCost: number;
  layovers?: Array<{ airport: string; duration: string }>;
  bookingTips?: string;
}

interface FlightsSectionProps {
  flights: {
    outbound: FlightDetails;
    return: FlightDetails;
  };
  currency: string;
}

export default function FlightsSection({
  flights,
  currency,
}: FlightsSectionProps) {
  const FlightCard = ({
    flight,
    title,
  }: {
    flight: FlightDetails;
    title: string;
  }) => (
    <div className="bg-white rounded-lg shadow p-6 mb-6">
      <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
        <svg
          className="w-5 h-5 mr-2 text-primary-600"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8"
          />
        </svg>
        {title}
      </h3>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
        {/* Departure */}
        <div>
          <div className="text-sm text-gray-500 mb-1">Departure</div>
          <div className="font-semibold text-lg">{flight.departure.time}</div>
          <div className="text-gray-700">{flight.departure.airport}</div>
          {flight.departure.terminal && (
            <div className="text-sm text-gray-500">
              Terminal {flight.departure.terminal}
            </div>
          )}
        </div>

        {/* Duration */}
        <div className="flex flex-col items-center justify-center">
          <div className="text-sm text-gray-500 mb-1">Duration</div>
          <div className="font-medium text-gray-700">{flight.duration}</div>
          <div className="w-full border-t-2 border-dashed border-gray-300 my-2"></div>
          {flight.layovers && flight.layovers.length > 0 && (
            <div className="text-xs text-orange-600">
              {flight.layovers.length} layover
              {flight.layovers.length > 1 ? 's' : ''}
            </div>
          )}
        </div>

        {/* Arrival */}
        <div className="text-right md:text-left">
          <div className="text-sm text-gray-500 mb-1">Arrival</div>
          <div className="font-semibold text-lg">{flight.arrival.time}</div>
          <div className="text-gray-700">{flight.arrival.airport}</div>
          {flight.arrival.terminal && (
            <div className="text-sm text-gray-500">
              Terminal {flight.arrival.terminal}
            </div>
          )}
        </div>
      </div>

      {/* Flight Details */}
      <div className="border-t border-gray-200 pt-4">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-4">
          <div>
            <div className="text-sm text-gray-500">Airline</div>
            <div className="font-medium">{flight.airline}</div>
          </div>
          <div>
            <div className="text-sm text-gray-500">Flight Number</div>
            <div className="font-medium">{flight.flightNumber}</div>
          </div>
          <div>
            <div className="text-sm text-gray-500">Class</div>
            <div className="font-medium">{flight.class}</div>
          </div>
          <div>
            <div className="text-sm text-gray-500">Estimated Cost</div>
            <div className="font-semibold text-primary-600">
              {currency} {flight.estimatedCost.toLocaleString()}
            </div>
          </div>
        </div>

        {/* Layovers */}
        {flight.layovers && flight.layovers.length > 0 && (
          <div className="mb-4">
            <div className="text-sm font-medium text-gray-700 mb-2">
              Layovers:
            </div>
            <div className="space-y-1">
              {flight.layovers.map((layover, idx) => (
                <div key={idx} className="text-sm text-gray-600 flex items-center">
                  <svg
                    className="w-4 h-4 mr-2 text-gray-400"
                    fill="currentColor"
                    viewBox="0 0 20 20"
                  >
                    <path
                      fillRule="evenodd"
                      d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-12a1 1 0 10-2 0v4a1 1 0 00.293.707l2.828 2.829a1 1 0 101.415-1.415L11 9.586V6z"
                      clipRule="evenodd"
                    />
                  </svg>
                  {layover.airport} - {layover.duration}
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Booking Tips */}
        {flight.bookingTips && (
          <div className="bg-blue-50 border border-blue-200 rounded p-3">
            <div className="flex">
              <svg
                className="w-5 h-5 text-blue-400 mr-2 flex-shrink-0"
                fill="currentColor"
                viewBox="0 0 20 20"
              >
                <path
                  fillRule="evenodd"
                  d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z"
                  clipRule="evenodd"
                />
              </svg>
              <div>
                <div className="text-sm font-medium text-blue-800 mb-1">
                  Booking Tips
                </div>
                <p className="text-sm text-blue-700">{flight.bookingTips}</p>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );

  const totalCost = flights.outbound.estimatedCost + flights.return.estimatedCost;

  return (
    <div className="space-y-6">
      <div className="bg-primary-50 border border-primary-200 rounded-lg p-4">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="text-sm font-medium text-primary-800">
              Total Flight Cost
            </h3>
            <p className="text-2xl font-bold text-primary-600 mt-1">
              {currency} {totalCost.toLocaleString()}
            </p>
          </div>
          <svg
            className="w-12 h-12 text-primary-400"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8"
            />
          </svg>
        </div>
      </div>

      <FlightCard flight={flights.outbound} title="Outbound Flight" />
      <FlightCard flight={flights.return} title="Return Flight" />
    </div>
  );
}
