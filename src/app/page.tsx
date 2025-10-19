'use client';

import { useState } from 'react';
import Link from 'next/link';
import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import toast from 'react-hot-toast';
import Modal from '@/components/ui/Modal';
import Button from '@/components/ui/Button';
import SearchableSelect from '@/components/ui/SearchableSelect';
import { COUNTRIES } from '@/types/plan';

export default function Home() {
  const { data: session } = useSession();
  const router = useRouter();
  const [showPreviewModal, setShowPreviewModal] = useState(false);
  const [loading, setLoading] = useState(false);
  const [teaserData, setTeaserData] = useState({
    destination: '',
    days: 3,
    budget: 'moderate',
    interests: [] as string[],
    accommodation: 'hotel',
    travelers: 1,
  });
  const [preview, setPreview] = useState<{
    highlights: string[];
    mustSee: string[];
    budgetTip: string;
    hiddenGems: string[];
    estimatedCost: string;
    bestTimeToVisit: string;
  } | null>(null);

  const handleTeaserSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!teaserData.destination) {
      toast.error('Please select a destination');
      return;
    }

    setLoading(true);
    try {
      const response = await fetch('/api/ai/teaser', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(teaserData),
      });

      if (!response.ok) throw new Error('Failed to generate preview');

      const data = await response.json();
      setPreview(data);
      setShowPreviewModal(true);
    } catch (error) {
      toast.error('Failed to generate preview');
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900">
      {/* Navigation */}
      <nav className="fixed top-0 w-full z-50 bg-slate-900/80 backdrop-blur-xl border-b border-white/10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-20">
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 bg-gradient-to-br from-purple-500 to-pink-500 rounded-xl flex items-center justify-center">
                <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3.055 11H5a2 2 0 012 2v1a2 2 0 002 2 2 2 0 012 2v2.945M8 3.935V5.5A2.5 2.5 0 0010.5 8h.5a2 2 0 012 2 2 2 0 104 0 2 2 0 012-2h1.064M15 20.488V18a2 2 0 012-2h3.064M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              <span className="text-2xl font-bold text-white">TravelAI</span>
            </div>
            <div className="hidden md:flex items-center space-x-8">
              <a href="#features" className="text-gray-300 hover:text-white transition-colors">
                Features
              </a>
              <a href="#how-it-works" className="text-gray-300 hover:text-white transition-colors">
                How It Works
              </a>
              {session ? (
                <>
                  <Link href="/dashboard" className="text-gray-300 hover:text-white transition-colors">
                    Dashboard
                  </Link>
                  <Link
                    href="/plan/new"
                    className="px-6 py-2.5 bg-gradient-to-r from-purple-500 to-pink-500 text-white rounded-full font-medium hover:shadow-lg hover:shadow-purple-500/50 transition-all duration-300 hover:scale-105 flex items-center"
                  >
                    <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                    </svg>
                    Create Plan
                  </Link>
                  <div className="flex items-center space-x-3">
                    <div className="w-9 h-9 bg-gradient-to-br from-purple-400 to-pink-400 rounded-full flex items-center justify-center">
                      <span className="text-sm font-semibold text-white">
                        {session.user?.name?.charAt(0).toUpperCase() || session.user?.email?.charAt(0).toUpperCase()}
                      </span>
                    </div>
                  </div>
                </>
              ) : (
                <>
                  <Link href="/login" className="text-gray-300 hover:text-white transition-colors">
                    Sign In
                  </Link>
                  <Link
                    href="/register"
                    className="px-6 py-2.5 bg-gradient-to-r from-purple-500 to-pink-500 text-white rounded-full font-medium hover:shadow-lg hover:shadow-purple-500/50 transition-all duration-300 hover:scale-105"
                  >
                    Get Started Free
                  </Link>
                </>
              )}
            </div>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="relative pt-32 pb-12 px-4 sm:px-6 lg:px-8 overflow-hidden">
        {/* Animated background elements */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-purple-500/20 rounded-full blur-3xl animate-pulse"></div>
          <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-pink-500/20 rounded-full blur-3xl animate-pulse" style={{animationDelay: '1s'}}></div>
        </div>

        <div className="max-w-7xl mx-auto relative z-10">
          <div className="text-center max-w-4xl mx-auto">
            <div className="inline-flex items-center px-4 py-2 bg-white/10 backdrop-blur-sm border border-white/20 rounded-full text-sm text-purple-200 mb-8">
              <span className="w-2 h-2 bg-green-400 rounded-full mr-2 animate-pulse"></span>
              Powered by GPT-4o AI Technology
            </div>

            <h1 className="text-5xl md:text-7xl font-bold text-white mb-6 leading-tight">
              Your AI Travel Planner
              <span className="block bg-gradient-to-r from-purple-400 via-pink-400 to-purple-400 text-transparent bg-clip-text">
                Powered by Intelligence
              </span>
            </h1>

            <p className="text-xl md:text-2xl text-gray-300 mb-12 leading-relaxed max-w-3xl mx-auto">
              Create personalized, comprehensive travel itineraries in seconds with our AI-powered platform.
              Smart recommendations, detailed plans, and everything you need for the perfect trip.
            </p>

            {session ? (
              <div className="flex justify-center">
                <Link
                  href="/plan/new"
                  className="group px-8 py-4 bg-gradient-to-r from-purple-500 to-pink-500 text-white rounded-full font-semibold text-lg hover:shadow-2xl hover:shadow-purple-500/50 transition-all duration-300 hover:scale-105 flex items-center"
                >
                  Create Full Plan
                  <svg className="w-5 h-5 ml-2 group-hover:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
                  </svg>
                </Link>
              </div>
            ) : (
              <div className="mt-8 max-w-2xl mx-auto">
                <div className="bg-white/10 backdrop-blur-xl border border-white/20 rounded-3xl p-8 shadow-2xl">
                  <div className="text-center mb-6">
                    <h3 className="text-2xl font-bold text-white mb-2">
                      Get Your Free Travel Preview
                    </h3>
                    <p className="text-gray-300">
                      See what AI can do for your trip - no sign up required!
                    </p>
                  </div>

                  <form onSubmit={handleTeaserSubmit} className="space-y-5">
                    <SearchableSelect
                      id="teaserDestination"
                      label="Where do you want to go?"
                      value={teaserData.destination}
                      onChange={(value) => setTeaserData({ ...teaserData, destination: value })}
                      options={COUNTRIES.map((country) => ({ value: country, label: country }))}
                      placeholder="Search countries..."
                      required
                    />

                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-200 mb-2">
                          How many days?
                        </label>
                        <select
                          value={teaserData.days}
                          onChange={(e) => setTeaserData({ ...teaserData, days: parseInt(e.target.value) })}
                          className="w-full px-4 py-3 bg-white/10 backdrop-blur-sm border-2 border-white/30 rounded-xl text-white focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all"
                        >
                          {[3, 5, 7, 10, 14, 21].map((days) => (
                            <option key={days} value={days} className="bg-slate-800">
                              {days} days
                            </option>
                          ))}
                        </select>
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-gray-200 mb-2">
                          Travel style
                        </label>
                        <select
                          value={teaserData.budget}
                          onChange={(e) => setTeaserData({ ...teaserData, budget: e.target.value })}
                          className="w-full px-4 py-3 bg-white/10 backdrop-blur-sm border-2 border-white/30 rounded-xl text-white focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all"
                        >
                          <option value="budget" className="bg-slate-800">Budget-Friendly</option>
                          <option value="moderate" className="bg-slate-800">Moderate</option>
                          <option value="luxury" className="bg-slate-800">Luxury</option>
                        </select>
                      </div>
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-200 mb-2">
                          Number of travelers
                        </label>
                        <select
                          value={teaserData.travelers}
                          onChange={(e) => setTeaserData({ ...teaserData, travelers: parseInt(e.target.value) })}
                          className="w-full px-4 py-3 bg-white/10 backdrop-blur-sm border-2 border-white/30 rounded-xl text-white focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all"
                        >
                          <option value={1} className="bg-slate-800">Solo Traveler</option>
                          <option value={2} className="bg-slate-800">Couple (2 people)</option>
                          <option value={4} className="bg-slate-800">Family (4 people)</option>
                          <option value={6} className="bg-slate-800">Group (6+ people)</option>
                        </select>
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-gray-200 mb-2">
                          Accommodation type
                        </label>
                        <select
                          value={teaserData.accommodation}
                          onChange={(e) => setTeaserData({ ...teaserData, accommodation: e.target.value })}
                          className="w-full px-4 py-3 bg-white/10 backdrop-blur-sm border-2 border-white/30 rounded-xl text-white focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all"
                        >
                          <option value="hostel" className="bg-slate-800">Hostel</option>
                          <option value="hotel" className="bg-slate-800">Hotel</option>
                          <option value="resort" className="bg-slate-800">Resort</option>
                          <option value="vacation-rental" className="bg-slate-800">Vacation Rental</option>
                        </select>
                      </div>
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-200 mb-3">
                        What interests you most? (Select all that apply)
                      </label>
                      <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                        {[
                          { value: 'culture', label: 'Culture & History', icon: '🏛️' },
                          { value: 'adventure', label: 'Adventure', icon: '🏔️' },
                          { value: 'food', label: 'Food & Dining', icon: '🍜' },
                          { value: 'nature', label: 'Nature & Wildlife', icon: '🌿' },
                          { value: 'nightlife', label: 'Nightlife', icon: '🎉' },
                          { value: 'relaxation', label: 'Relaxation', icon: '🏖️' },
                        ].map((interest) => (
                          <button
                            key={interest.value}
                            type="button"
                            onClick={() => {
                              const interests = teaserData.interests.includes(interest.value)
                                ? teaserData.interests.filter(i => i !== interest.value)
                                : [...teaserData.interests, interest.value];
                              setTeaserData({ ...teaserData, interests });
                            }}
                            className={`px-3 py-2.5 rounded-lg border-2 transition-all text-sm font-medium ${
                              teaserData.interests.includes(interest.value)
                                ? 'bg-purple-500/30 border-purple-500 text-white'
                                : 'bg-white/5 border-white/20 text-gray-300 hover:border-white/40'
                            }`}
                          >
                            <span className="mr-1.5">{interest.icon}</span>
                            {interest.label}
                          </button>
                        ))}
                      </div>
                    </div>

                    <Button
                      type="submit"
                      fullWidth
                      loading={loading}
                      size="lg"
                      variant="gradient"
                    >
                      Get My Free Preview
                    </Button>

                    <p className="text-center text-sm text-gray-400">
                      Get highlights, must-see places & budget tips instantly
                    </p>
                  </form>
                </div>
              </div>
            )}

            {/* Trust badges */}
            <div className="mt-16 flex flex-wrap justify-center items-center gap-8 text-gray-400 text-sm">
              <div className="flex items-center">
                <svg className="w-5 h-5 text-green-400 mr-2" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                </svg>
                No credit card required
              </div>
              <div className="flex items-center">
                <svg className="w-5 h-5 text-green-400 mr-2" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                </svg>
                Free plan available
              </div>
              <div className="flex items-center">
                <svg className="w-5 h-5 text-green-400 mr-2" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                </svg>
                Instant results
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section id="features" className="py-20 px-4 sm:px-6 lg:px-8 relative">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-bold text-white mb-4">
              Everything You Need for Perfect Travel
            </h2>
            <p className="text-xl text-gray-400 max-w-2xl mx-auto">
              Powered by advanced AI to create comprehensive, personalized itineraries
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {[
              {
                icon: (
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
                ),
                title: "AI-Powered Planning",
                description: "GPT-4o analyzes your preferences to create personalized itineraries with flights, hotels, and daily activities in seconds."
              },
              {
                icon: (
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                ),
                title: "Real-Time Itineraries",
                description: "Get detailed day-by-day schedules with timing, locations, costs, and travel times between activities."
              },
              {
                icon: (
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 7h6m0 10v-3m-3 3h.01M9 17h.01M9 14h.01M12 14h.01M15 11h.01M12 11h.01M9 11h.01M7 21h10a2 2 0 002-2V5a2 2 0 00-2-2H7a2 2 0 00-2 2v14a2 2 0 002 2z" />
                ),
                title: "Smart Budget Planning",
                description: "Automatic budget breakdown by category with visual charts, per-person costs, and daily spending estimates."
              },
              {
                icon: (
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 21v-4m0 0V5a2 2 0 012-2h6.5l1 1H21l-3 6 3 6h-8.5l-1-1H5a2 2 0 00-2 2zm9-13.5V9" />
                ),
                title: "Flight Recommendations",
                description: "Get curated flight options with timing, layovers, and booking tips tailored to your preferences and budget."
              },
              {
                icon: (
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
                ),
                title: "Hotel Curation",
                description: "AI-selected accommodations with amenities, location benefits, and alternative options to match your style."
              },
              {
                icon: (
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                ),
                title: "PDF Export",
                description: "Download beautifully formatted travel guides with all details, emergency contacts, and offline access."
              },
            ].map((feature, idx) => (
              <div
                key={idx}
                className="group p-8 bg-white/5 backdrop-blur-sm border border-white/10 rounded-2xl hover:bg-white/10 hover:border-purple-500/50 transition-all duration-300 hover:scale-105 hover:shadow-xl hover:shadow-purple-500/20"
              >
                <div className="w-14 h-14 bg-gradient-to-br from-purple-500 to-pink-500 rounded-xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
                  <svg className="w-7 h-7 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    {feature.icon}
                  </svg>
                </div>
                <h3 className="text-xl font-semibold text-white mb-3">{feature.title}</h3>
                <p className="text-gray-400 leading-relaxed">{feature.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* How It Works Section */}
      <section id="how-it-works" className="py-20 px-4 sm:px-6 lg:px-8 relative">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-bold text-white mb-4">
              Your Perfect Trip in 3 Simple Steps
            </h2>
            <p className="text-xl text-gray-400">
              From idea to complete itinerary in under a minute
            </p>
          </div>

          <div className="relative">
            {/* Connection line */}
            <div className="hidden lg:block absolute top-1/2 left-0 right-0 h-0.5 bg-gradient-to-r from-purple-500 via-pink-500 to-purple-500 -translate-y-1/2"></div>

            <div className="grid lg:grid-cols-3 gap-8 relative z-10">
              {[
                {
                  step: "01",
                  title: "Tell Us Your Dreams",
                  description: "Share your destination, dates, budget, and travel style. Our wizard guides you through every detail.",
                  icon: (
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                  )
                },
                {
                  step: "02",
                  title: "AI Crafts Your Plan",
                  description: "Our GPT-4o AI analyzes millions of data points to create your personalized itinerary in 20 seconds.",
                  icon: (
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                  )
                },
                {
                  step: "03",
                  title: "Refine & Export",
                  description: "Edit any detail, finalize your plan, and export to PDF. Your perfect trip is ready to go!",
                  icon: (
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                  )
                },
              ].map((step, idx) => (
                <div key={idx} className="relative">
                  <div className="bg-gradient-to-br from-white/10 to-white/5 backdrop-blur-sm border border-white/20 rounded-2xl p-8 hover:border-purple-500/50 transition-all duration-300">
                    <div className="w-16 h-16 bg-gradient-to-br from-purple-500 to-pink-500 rounded-xl flex items-center justify-center mb-6">
                      <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        {step.icon}
                      </svg>
                    </div>
                    <div className="text-5xl font-bold text-purple-500/20 mb-4">{step.step}</div>
                    <h3 className="text-2xl font-bold text-white mb-4">{step.title}</h3>
                    <p className="text-gray-400 leading-relaxed">{step.description}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 px-4 sm:px-6 lg:px-8 relative">
        <div className="max-w-5xl mx-auto">
          <div className="relative bg-gradient-to-r from-purple-600 to-pink-600 rounded-3xl p-12 md:p-16 overflow-hidden">
            <div className="absolute inset-0 bg-black/20"></div>
            <div className="relative z-10 text-center">
              <h2 className="text-4xl md:text-5xl font-bold text-white mb-6">
                Ready to Plan Your Next Adventure?
              </h2>
              <p className="text-xl text-purple-100 mb-8 max-w-2xl mx-auto">
                Join thousands of travelers using AI to create unforgettable journeys. Start planning your perfect trip today.
              </p>
              <Link
                href="/register"
                className="inline-flex items-center px-8 py-4 bg-white text-purple-600 rounded-full font-semibold text-lg hover:shadow-2xl hover:scale-105 transition-all duration-300"
              >
                Get Started Free
                <svg className="w-5 h-5 ml-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
                </svg>
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-white/10 py-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <div className="grid md:grid-cols-4 gap-8 mb-8">
            <div className="md:col-span-2">
              <div className="flex items-center space-x-3 mb-4">
                <div className="w-10 h-10 bg-gradient-to-br from-purple-500 to-pink-500 rounded-xl flex items-center justify-center">
                  <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3.055 11H5a2 2 0 012 2v1a2 2 0 002 2 2 2 0 012 2v2.945M8 3.935V5.5A2.5 2.5 0 0010.5 8h.5a2 2 0 012 2 2 2 0 104 0 2 2 0 012-2h1.064M15 20.488V18a2 2 0 012-2h3.064M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                </div>
                <span className="text-2xl font-bold text-white">TravelAI</span>
              </div>
              <p className="text-gray-400 max-w-md">
                The intelligent way to plan your travels. Powered by GPT-4o AI technology to create personalized itineraries in seconds.
              </p>
            </div>
            <div>
              <h4 className="text-white font-semibold mb-4">Product</h4>
              <ul className="space-y-2">
                <li><a href="#features" className="text-gray-400 hover:text-white transition-colors">Features</a></li>
                <li><a href="#how-it-works" className="text-gray-400 hover:text-white transition-colors">How It Works</a></li>
                <li><Link href="/dashboard" className="text-gray-400 hover:text-white transition-colors">Dashboard</Link></li>
              </ul>
            </div>
            <div>
              <h4 className="text-white font-semibold mb-4">Company</h4>
              <ul className="space-y-2">
                <li><Link href="/login" className="text-gray-400 hover:text-white transition-colors">Sign In</Link></li>
                <li><Link href="/register" className="text-gray-400 hover:text-white transition-colors">Get Started</Link></li>
              </ul>
            </div>
          </div>
          <div className="border-t border-white/10 pt-8 text-center text-gray-400">
            <p>&copy; 2024 TravelAI. Powered by Claude Code. All rights reserved.</p>
          </div>
        </div>
      </footer>

      {/* Preview Result Modal */}
      <Modal
        isOpen={showPreviewModal}
        onClose={() => setShowPreviewModal(false)}
        size="xl"
        title={
          <div className="flex items-center">
            <span className="text-2xl font-bold bg-gradient-to-r from-purple-400 to-pink-400 text-transparent bg-clip-text">
              {teaserData.destination} Awaits You
            </span>
          </div>
        }
      >
        {preview && (
          <div className="space-y-6">
            {/* Hero stats */}
            <div className="grid grid-cols-2 gap-3">
              <div className="bg-gradient-to-br from-purple-500/20 to-purple-600/20 border border-purple-500/30 rounded-xl p-4 text-center">
                <div className="text-2xl font-bold text-white mb-1">{preview.estimatedCost}</div>
                <div className="text-xs text-purple-200">Estimated Budget</div>
              </div>
              <div className="bg-gradient-to-br from-pink-500/20 to-pink-600/20 border border-pink-500/30 rounded-xl p-4 text-center">
                <div className="text-sm font-semibold text-white mb-1">{preview.bestTimeToVisit}</div>
                <div className="text-xs text-pink-200">Best Time to Visit</div>
              </div>
            </div>

            {/* Teaser notice */}
            <div className="relative bg-gradient-to-r from-purple-500/10 via-pink-500/10 to-purple-500/10 border border-purple-500/30 rounded-xl p-4 overflow-hidden">
              <div className="absolute top-0 right-0 w-20 h-20 bg-purple-500/20 rounded-full blur-2xl"></div>
              <div className="relative flex items-start">
                <div className="flex-shrink-0">
                  <svg className="w-6 h-6 text-purple-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                </div>
                <div className="ml-3 flex-1">
                  <p className="text-sm font-medium text-purple-100 mb-1">
                    This is just a sneak peek!
                  </p>
                  <p className="text-xs text-purple-200/80">
                    The full itinerary includes day-by-day schedules, flight options, hotel recommendations, activity bookings, and a downloadable PDF guide.
                  </p>
                </div>
              </div>
            </div>

            <div className="grid md:grid-cols-2 gap-4">
              {/* Highlights */}
              <div className="bg-white/5 border border-white/10 rounded-xl p-5">
                <h3 className="text-base font-bold text-white mb-4 flex items-center">
                  <svg className="w-5 h-5 mr-2 text-purple-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 3v4M3 5h4M6 17v4m-2-2h4m5-16l2.286 6.857L21 12l-5.714 2.143L13 21l-2.286-6.857L5 12l5.714-2.143L13 3z" />
                  </svg>
                  Trip Highlights
                </h3>
                <ul className="space-y-2.5">
                  {preview.highlights.map((highlight, idx) => (
                    <li key={idx} className="flex items-start text-sm text-gray-300 leading-snug">
                      <svg className="w-4 h-4 text-green-400 mr-2 mt-0.5 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                      </svg>
                      {highlight}
                    </li>
                  ))}
                </ul>
              </div>

              {/* Must-See */}
              <div className="bg-white/5 border border-white/10 rounded-xl p-5">
                <h3 className="text-base font-bold text-white mb-4 flex items-center">
                  <svg className="w-5 h-5 mr-2 text-pink-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                  </svg>
                  Must-See Places
                </h3>
                <ul className="space-y-2.5">
                  {preview.mustSee.slice(0, 4).map((place, idx) => (
                    <li key={idx} className="flex items-start text-sm text-gray-300 leading-snug">
                      <svg className="w-4 h-4 text-pink-400 mr-2 mt-0.5 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M5.05 4.05a7 7 0 119.9 9.9L10 18.9l-4.95-4.95a7 7 0 010-9.9zM10 11a2 2 0 100-4 2 2 0 000 4z" clipRule="evenodd" />
                      </svg>
                      {place}
                    </li>
                  ))}
                  {preview.mustSee.length > 4 && (
                    <li className="text-xs text-purple-300 font-medium pl-6 pt-1">
                      + {preview.mustSee.length - 4} more iconic locations in full plan
                    </li>
                  )}
                </ul>
              </div>
            </div>

            {/* Hidden Gems - Curiosity Driver */}
            <div className="bg-gradient-to-br from-amber-500/10 to-orange-500/10 border-2 border-amber-500/30 rounded-xl p-5 relative overflow-hidden">
              <div className="absolute top-0 right-0 w-32 h-32 bg-amber-500/10 rounded-full blur-3xl"></div>
              <div className="relative">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-base font-bold text-white flex items-center">
                    <svg className="w-5 h-5 mr-2 text-amber-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 11c0 3.517-1.009 6.799-2.753 9.571m-3.44-2.04l.054-.09A13.916 13.916 0 008 11a4 4 0 118 0c0 1.017-.07 2.019-.203 3m-2.118 6.844A21.88 21.88 0 0015.171 17m3.839 1.132c.645-2.266.99-4.659.99-7.132A8 8 0 008 4.07M3 15.364c.64-1.319 1-2.8 1-4.364 0-1.457.39-2.823 1.07-4" />
                    </svg>
                    Local Hidden Gems
                    <span className="ml-2 px-2 py-0.5 bg-amber-500/20 text-amber-300 text-xs font-bold rounded-full">Secret Spots</span>
                  </h3>
                </div>
                <ul className="space-y-2.5 mb-4">
                  {preview.hiddenGems.map((gem, idx) => (
                    <li key={idx} className="flex items-start text-sm text-gray-200 leading-snug">
                      <svg className="w-4 h-4 text-amber-400 mr-2 mt-0.5 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                        <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                      </svg>
                      {gem}
                    </li>
                  ))}
                </ul>
                <p className="text-xs text-amber-200/80 italic">
                  These are places most tourists never discover. Want to know more insider secrets?
                </p>
              </div>
            </div>

            {/* Budget Tip */}
            <div className="bg-gradient-to-r from-green-500/10 to-emerald-500/10 border border-green-500/30 rounded-xl p-4">
              <h3 className="text-sm font-bold text-white mb-2 flex items-center">
                <svg className="w-5 h-5 mr-2 text-green-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                Pro Budget Tip
              </h3>
              <p className="text-sm text-gray-200">{preview.budgetTip}</p>
            </div>

            {/* What's Missing Tease */}
            <div className="bg-gradient-to-r from-slate-800/50 to-slate-700/50 border border-slate-600/30 rounded-xl p-5">
              <h3 className="text-sm font-bold text-white mb-3">
                What you'll get in the full itinerary:
              </h3>
              <div className="grid grid-cols-2 gap-3 text-xs">
                {[
                  { icon: '✈️', text: 'Flight recommendations & booking tips' },
                  { icon: '🏨', text: 'Curated hotels for each night' },
                  { icon: '📅', text: 'Hour-by-hour daily schedules' },
                  { icon: '🍽️', text: 'Restaurant reservations needed' },
                  { icon: '💰', text: 'Detailed budget breakdown' },
                  { icon: '🗺️', text: 'Transportation between locations' },
                  { icon: '📱', text: 'Emergency contacts & tips' },
                  { icon: '📄', text: 'Downloadable PDF guide' },
                ].map((item, idx) => (
                  <div key={idx} className="flex items-center text-gray-300">
                    <span className="mr-2 text-base">{item.icon}</span>
                    <span>{item.text}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* CTA */}
            <div className="space-y-3 pt-2">
              <Button
                onClick={() => router.push('/register')}
                fullWidth
                variant="gradient"
                size="lg"
                className="shadow-xl shadow-purple-500/30"
              >
                <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                </svg>
                Create My Complete Itinerary - Free
              </Button>
              <p className="text-xs text-center text-gray-400">
                No credit card required • Free plan available • Takes 60 seconds
              </p>
            </div>
          </div>
        )}
      </Modal>
    </div>
  );
}
