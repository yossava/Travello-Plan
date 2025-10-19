import Link from 'next/link';
import Navbar from '@/components/layout/Navbar';
import Footer from '@/components/layout/Footer';

export default function Home() {
  return (
    <div className="min-h-screen flex flex-col bg-gradient-to-b from-primary-50 to-white">
      <Navbar />
      <main className="flex flex-col items-center justify-center px-4 py-24">
        <div className="text-center max-w-3xl">
          <h1 className="text-5xl font-bold text-gray-900 mb-6">
            Plan Your Perfect Trip with AI
          </h1>
          <p className="text-xl text-gray-600 mb-8">
            Create personalized travel itineraries in minutes. Get flight
            options, accommodation recommendations, and day-by-day plans
            tailored to your preferences.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link
              href="/register"
              className="bg-primary-600 text-white hover:bg-primary-700 px-8 py-3 rounded-md text-lg font-medium shadow-lg transition-colors"
            >
              Get Started Free
            </Link>
            <Link
              href="/login"
              className="bg-white text-primary-600 hover:bg-gray-50 px-8 py-3 rounded-md text-lg font-medium border-2 border-primary-600 transition-colors"
            >
              Sign In
            </Link>
          </div>
        </div>

        <div className="mt-20 grid grid-cols-1 md:grid-cols-3 gap-8 max-w-5xl">
          <div className="text-center p-6">
            <div className="bg-primary-100 rounded-full w-16 h-16 flex items-center justify-center mx-auto mb-4">
              <svg
                className="w-8 h-8 text-primary-600"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2"
                />
              </svg>
            </div>
            <h3 className="text-lg font-semibold text-gray-900 mb-2">
              Smart Planning
            </h3>
            <p className="text-gray-600">
              Answer a few questions and get a comprehensive travel plan
            </p>
          </div>

          <div className="text-center p-6">
            <div className="bg-primary-100 rounded-full w-16 h-16 flex items-center justify-center mx-auto mb-4">
              <svg
                className="w-8 h-8 text-primary-600"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
                />
              </svg>
            </div>
            <h3 className="text-lg font-semibold text-gray-900 mb-2">
              Day-by-Day Itinerary
            </h3>
            <p className="text-gray-600">
              Detailed schedule with activities, meals, and travel times
            </p>
          </div>

          <div className="text-center p-6">
            <div className="bg-primary-100 rounded-full w-16 h-16 flex items-center justify-center mx-auto mb-4">
              <svg
                className="w-8 h-8 text-primary-600"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M7 21h10a2 2 0 002-2V9.414a1 1 0 00-.293-.707l-5.414-5.414A1 1 0 0012.586 3H7a2 2 0 00-2 2v14a2 2 0 002 2z"
                />
              </svg>
            </div>
            <h3 className="text-lg font-semibold text-gray-900 mb-2">
              Export to PDF
            </h3>
            <p className="text-gray-600">
              Download and print your itinerary for offline access
            </p>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
}
