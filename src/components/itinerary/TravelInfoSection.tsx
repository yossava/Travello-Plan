interface TravelInfo {
  visaRequirements: string;
  healthAndSafety: string;
  currency: {
    name: string;
    exchangeRate: string;
    tips: string;
  };
  language: {
    primary: string;
    usefulPhrases: string[];
  };
  simAndConnectivity: string;
  transportation: {
    overview: string;
    options: string[];
  };
  tipping: string;
  emergencyContacts: {
    police: string;
    ambulance: string;
    embassy: string;
  };
  weather: string;
  packingList: string[];
  culturalTips: string[];
}

interface TravelInfoSectionProps {
  travelInfo: TravelInfo;
}

export default function TravelInfoSection({
  travelInfo,
}: TravelInfoSectionProps) {
  return (
    <div className="space-y-6">
      {/* Emergency Contacts - Most Important */}
      <div className="bg-red-50 border-2 border-red-300 rounded-lg p-6">
        <div className="flex items-center mb-4">
          <svg
            className="w-6 h-6 text-red-600 mr-2"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"
            />
          </svg>
          <h3 className="text-lg font-semibold text-red-900">
            Emergency Contacts
          </h3>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="bg-white rounded p-3">
            <div className="text-sm text-red-700 font-medium mb-1">Police</div>
            <div className="text-xl font-bold text-red-900">
              {travelInfo.emergencyContacts.police}
            </div>
          </div>
          <div className="bg-white rounded p-3">
            <div className="text-sm text-red-700 font-medium mb-1">
              Ambulance
            </div>
            <div className="text-xl font-bold text-red-900">
              {travelInfo.emergencyContacts.ambulance}
            </div>
          </div>
          <div className="bg-white rounded p-3">
            <div className="text-sm text-red-700 font-medium mb-1">Embassy</div>
            <div className="text-xl font-bold text-red-900">
              {travelInfo.emergencyContacts.embassy}
            </div>
          </div>
        </div>
      </div>

      {/* Visa and Entry Requirements */}
      <div className="bg-white rounded-lg shadow p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-3 flex items-center">
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
              d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
            />
          </svg>
          Visa & Entry Requirements
        </h3>
        <p className="text-gray-700">{travelInfo.visaRequirements}</p>
      </div>

      {/* Health and Safety */}
      <div className="bg-white rounded-lg shadow p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-3 flex items-center">
          <svg
            className="w-5 h-5 mr-2 text-green-600"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z"
            />
          </svg>
          Health & Safety
        </h3>
        <p className="text-gray-700">{travelInfo.healthAndSafety}</p>
      </div>

      {/* Currency and Money */}
      <div className="bg-white rounded-lg shadow p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-3 flex items-center">
          <svg
            className="w-5 h-5 mr-2 text-yellow-600"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
            />
          </svg>
          Currency & Money
        </h3>
        <div className="space-y-2">
          <div>
            <span className="font-medium text-gray-700">Currency: </span>
            <span className="text-gray-600">{travelInfo.currency.name}</span>
          </div>
          <div>
            <span className="font-medium text-gray-700">Exchange Rate: </span>
            <span className="text-gray-600">
              {travelInfo.currency.exchangeRate}
            </span>
          </div>
          <div>
            <span className="font-medium text-gray-700">Tips: </span>
            <span className="text-gray-600">{travelInfo.currency.tips}</span>
          </div>
          <div>
            <span className="font-medium text-gray-700">Tipping: </span>
            <span className="text-gray-600">{travelInfo.tipping}</span>
          </div>
        </div>
      </div>

      {/* Language */}
      <div className="bg-white rounded-lg shadow p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-3 flex items-center">
          <svg
            className="w-5 h-5 mr-2 text-blue-600"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M3 5h12M9 3v2m1.048 9.5A18.022 18.022 0 016.412 9m6.088 9h7M11 21l5-10 5 10M12.751 5C11.783 10.77 8.07 15.61 3 18.129"
            />
          </svg>
          Language
        </h3>
        <div className="mb-3">
          <span className="font-medium text-gray-700">Primary Language: </span>
          <span className="text-gray-600">{travelInfo.language.primary}</span>
        </div>
        {travelInfo.language.usefulPhrases.length > 0 && (
          <div>
            <div className="font-medium text-gray-700 mb-2">
              Useful Phrases:
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
              {travelInfo.language.usefulPhrases.map((phrase, idx) => (
                <div
                  key={idx}
                  className="bg-gray-50 rounded px-3 py-2 text-sm text-gray-700"
                >
                  {phrase}
                </div>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* Transportation */}
      <div className="bg-white rounded-lg shadow p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-3 flex items-center">
          <svg
            className="w-5 h-5 mr-2 text-purple-600"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M8 7h12m0 0l-4-4m4 4l-4 4m0 6H4m0 0l4 4m-4-4l4-4"
            />
          </svg>
          Local Transportation
        </h3>
        <p className="text-gray-700 mb-3">{travelInfo.transportation.overview}</p>
        <div className="grid grid-cols-2 md:grid-cols-3 gap-2">
          {travelInfo.transportation.options.map((option, idx) => (
            <div
              key={idx}
              className="bg-purple-50 border border-purple-200 rounded px-3 py-2 text-sm text-purple-800 text-center"
            >
              {option}
            </div>
          ))}
        </div>
      </div>

      {/* Connectivity */}
      <div className="bg-white rounded-lg shadow p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-3 flex items-center">
          <svg
            className="w-5 h-5 mr-2 text-indigo-600"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M8.111 16.404a5.5 5.5 0 017.778 0M12 20h.01m-7.08-7.071c3.904-3.905 10.236-3.905 14.141 0M1.394 9.393c5.857-5.857 15.355-5.857 21.213 0"
            />
          </svg>
          SIM & Connectivity
        </h3>
        <p className="text-gray-700">{travelInfo.simAndConnectivity}</p>
      </div>

      {/* Weather and Packing */}
      <div className="bg-white rounded-lg shadow p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-3 flex items-center">
          <svg
            className="w-5 h-5 mr-2 text-orange-600"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M3 15a4 4 0 004 4h9a5 5 0 10-.1-9.999 5.002 5.002 0 10-9.78 2.096A4.001 4.001 0 003 15z"
            />
          </svg>
          Weather & Packing
        </h3>
        <p className="text-gray-700 mb-3">{travelInfo.weather}</p>
        {travelInfo.packingList.length > 0 && (
          <div>
            <div className="font-medium text-gray-700 mb-2">Packing List:</div>
            <div className="grid grid-cols-2 md:grid-cols-3 gap-2">
              {travelInfo.packingList.map((item, idx) => (
                <div key={idx} className="flex items-center text-sm text-gray-600">
                  <svg
                    className="w-4 h-4 mr-2 text-green-500"
                    fill="currentColor"
                    viewBox="0 0 20 20"
                  >
                    <path
                      fillRule="evenodd"
                      d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                      clipRule="evenodd"
                    />
                  </svg>
                  {item}
                </div>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* Cultural Tips */}
      {travelInfo.culturalTips.length > 0 && (
        <div className="bg-white rounded-lg shadow p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-3 flex items-center">
            <svg
              className="w-5 h-5 mr-2 text-pink-600"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z"
              />
            </svg>
            Cultural Tips & Etiquette
          </h3>
          <ul className="space-y-2">
            {travelInfo.culturalTips.map((tip, idx) => (
              <li key={idx} className="flex items-start">
                <svg
                  className="w-5 h-5 text-pink-500 mr-2 flex-shrink-0 mt-0.5"
                  fill="currentColor"
                  viewBox="0 0 20 20"
                >
                  <path
                    fillRule="evenodd"
                    d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z"
                    clipRule="evenodd"
                  />
                </svg>
                <span className="text-gray-700">{tip}</span>
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
}
