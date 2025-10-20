'use client';

import { useState } from 'react';
import Link from 'next/link';
import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import toast from 'react-hot-toast';
import { motion } from 'framer-motion';
import Modal from '@/components/ui/Modal';
import Button from '@/components/ui/Button';
import SearchableSelect from '@/components/ui/SearchableSelect';
import { COUNTRIES } from '@/types/plan';

export default function Home() {
  const { data: session } = useSession();
  const router = useRouter();
  const [showPreviewModal, setShowPreviewModal] = useState(false);
  const [loading, setLoading] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
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
    <div className="min-h-screen bg-white overflow-x-hidden">
      {/* Navigation */}
      <nav className="fixed top-0 w-full z-50 bg-white shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-20">
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 bg-gradient-to-br from-blue-600 to-cyan-500 rounded-lg flex items-center justify-center">
                <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3.055 11H5a2 2 0 012 2v1a2 2 0 002 2 2 2 0 012 2v2.945M8 3.935V5.5A2.5 2.5 0 0010.5 8h.5a2 2 0 012 2 2 2 0 104 0 2 2 0 012-2h1.064M15 20.488V18a2 2 0 012-2h3.064M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              <span className="text-2xl font-bold text-gray-900 font-display">AiTravello</span>
            </div>

            {/* Desktop Navigation */}
            <div className="hidden md:flex items-center space-x-8">
              <a href="#destinations" className="text-gray-700 hover:text-blue-600 transition-colors font-medium">
                Destinations
              </a>
              <a href="#features" className="text-gray-700 hover:text-blue-600 transition-colors font-medium">
                Features
              </a>
              <a href="#how-it-works" className="text-gray-700 hover:text-blue-600 transition-colors font-medium">
                How It Works
              </a>
              {session ? (
                <>
                  <Link href="/dashboard" className="text-gray-700 hover:text-blue-600 transition-colors font-medium">
                    Dashboard
                  </Link>
                  <Link
                    href="/plan/new"
                    className="px-6 py-2.5 bg-gradient-to-r from-blue-600 to-cyan-500 text-white rounded-lg font-medium hover:shadow-lg hover:shadow-blue-500/30 transition-all duration-300 hover:scale-105 flex items-center"
                  >
                    <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                    </svg>
                    Create Plan
                  </Link>
                  <div className="flex items-center space-x-3">
                    <div className="w-9 h-9 bg-gradient-to-br from-blue-500 to-cyan-400 rounded-full flex items-center justify-center">
                      <span className="text-sm font-semibold text-white">
                        {session.user?.name?.charAt(0).toUpperCase() || session.user?.email?.charAt(0).toUpperCase()}
                      </span>
                    </div>
                  </div>
                </>
              ) : (
                <>
                  <Link href="/login" className="text-gray-700 hover:text-blue-600 transition-colors font-medium">
                    Sign In
                  </Link>
                  <Link
                    href="/register"
                    className="px-6 py-2.5 bg-gradient-to-r from-blue-600 to-cyan-500 text-white rounded-lg font-medium hover:shadow-lg hover:shadow-blue-500/30 transition-all duration-300 hover:scale-105"
                  >
                    Get Started Free
                  </Link>
                </>
              )}
            </div>

            {/* Mobile menu button */}
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="md:hidden p-2 rounded-lg text-gray-700 hover:bg-gray-100 transition-colors relative z-50"
              aria-label="Toggle menu"
            >
              {mobileMenuOpen ? (
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              ) : (
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                </svg>
              )}
            </button>
          </div>
        </div>
      </nav>

      {/* Mobile Navigation Drawer */}
      {mobileMenuOpen && (
        <>
          {/* Backdrop */}
          <div
            className="fixed inset-0 bg-black/50 backdrop-blur-sm z-40 md:hidden transition-opacity duration-300"
            onClick={() => setMobileMenuOpen(false)}
            style={{ animation: 'fadeIn 0.3s ease-out' }}
          ></div>

          {/* Drawer */}
          <div
            className="fixed top-0 right-0 h-full w-80 max-w-[85%] bg-white shadow-2xl z-50 md:hidden"
            style={{ animation: 'slideInRight 0.3s ease-out' }}
          >
            <div className="flex flex-col h-full">
              {/* Drawer Header */}
              <div className="flex items-center justify-between p-6 border-b border-gray-200">
                <h2 className="text-xl font-bold text-gray-900 font-display">Menu</h2>
                <button
                  onClick={() => setMobileMenuOpen(false)}
                  className="p-2 rounded-lg text-gray-700 hover:bg-gray-100 transition-colors"
                  aria-label="Close menu"
                >
                  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>

              {/* Drawer Content */}
              <div className="flex-1 overflow-y-auto py-6 px-4">
                <div className="flex flex-col space-y-2">
                  <a
                    href="#destinations"
                    className="px-4 py-3 text-gray-700 hover:bg-gray-50 hover:text-blue-600 rounded-lg transition-colors font-medium"
                    onClick={() => setMobileMenuOpen(false)}
                  >
                    Destinations
                  </a>
                  <a
                    href="#features"
                    className="px-4 py-3 text-gray-700 hover:bg-gray-50 hover:text-blue-600 rounded-lg transition-colors font-medium"
                    onClick={() => setMobileMenuOpen(false)}
                  >
                    Features
                  </a>
                  <a
                    href="#how-it-works"
                    className="px-4 py-3 text-gray-700 hover:bg-gray-50 hover:text-blue-600 rounded-lg transition-colors font-medium"
                    onClick={() => setMobileMenuOpen(false)}
                  >
                    How It Works
                  </a>
                  {session ? (
                    <>
                      <Link
                        href="/dashboard"
                        className="px-4 py-3 text-gray-700 hover:bg-gray-50 hover:text-blue-600 rounded-lg transition-colors font-medium"
                        onClick={() => setMobileMenuOpen(false)}
                      >
                        Dashboard
                      </Link>
                    </>
                  ) : (
                    <>
                      <Link
                        href="/login"
                        className="px-4 py-3 text-gray-700 hover:bg-gray-50 hover:text-blue-600 rounded-lg transition-colors font-medium"
                        onClick={() => setMobileMenuOpen(false)}
                      >
                        Sign In
                      </Link>
                    </>
                  )}
                </div>
              </div>

              {/* Drawer Footer - CTA Button */}
              <div className="p-4 border-t border-gray-200">
                {session ? (
                  <Link
                    href="/plan/new"
                    className="w-full px-6 py-4 bg-gradient-to-r from-blue-600 to-cyan-500 text-white rounded-xl font-semibold text-center shadow-lg hover:shadow-xl transition-all duration-300 flex items-center justify-center gap-2"
                    onClick={() => setMobileMenuOpen(false)}
                  >
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                    </svg>
                    Create Plan
                  </Link>
                ) : (
                  <Link
                    href="/register"
                    className="w-full px-6 py-4 bg-gradient-to-r from-blue-600 to-cyan-500 text-white rounded-xl font-semibold text-center shadow-lg hover:shadow-xl transition-all duration-300 flex items-center justify-center gap-2"
                    onClick={() => setMobileMenuOpen(false)}
                  >
                    Get Started Free
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
                    </svg>
                  </Link>
                )}
              </div>
            </div>
          </div>
        </>
      )}

      {/* Hero Section - Creative Asymmetric Design */}
      <section className="relative pt-24 sm:pt-28 md:pt-32 pb-0 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="relative">
            {/* Floating Badge */}
            <motion.div
              className="flex justify-center lg:justify-start lg:block mb-2 sm:mb-3 lg:mb-0 px-2"
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
            >
              <motion.div
                className="inline-flex items-center px-4 sm:px-6 py-2 sm:py-3 bg-gradient-to-r from-emerald-400 to-teal-400 text-white rounded-full text-xs sm:text-sm font-medium shadow-xl shadow-emerald-500/30 whitespace-nowrap"
                animate={{ y: [0, -10, 0] }}
                transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
              >
                <span className="w-2 h-2 bg-white rounded-full mr-2 animate-pulse"></span>
                AI-Powered Planning
              </motion.div>
            </motion.div>

            <div className="grid lg:grid-cols-12 gap-8 lg:gap-16 items-start pt-8 sm:pt-12 lg:pt-16">
              {/* Left Content - 7 columns */}
              <div className="lg:col-span-7 space-y-8">
                <div className="space-y-6">
                  <motion.h1
                    className="text-5xl sm:text-6xl md:text-7xl lg:text-7xl xl:text-8xl font-black text-gray-900 leading-[1.1] tracking-tight font-display text-center lg:text-left"
                    initial={{ opacity: 0, y: 30 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.8, delay: 0.3 }}
                  >
                    Travel
                    <motion.span
                      className="block text-transparent bg-clip-text bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600 mt-2 pb-4"
                      initial={{ opacity: 0, x: -30 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ duration: 0.8, delay: 0.5 }}
                    >
                      Reimagined
                    </motion.span>
                  </motion.h1>

                  <motion.p
                    className="text-lg sm:text-xl md:text-2xl text-gray-600 font-light max-w-xl leading-relaxed text-center lg:text-left mx-auto lg:mx-0"
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.8, delay: 0.7 }}
                  >
                    AI that understands your wanderlust. Create extraordinary journeys tailored to your style in seconds.
                  </motion.p>
                </div>

                {/* Stats */}
                <motion.div
                  className="flex flex-wrap justify-center lg:justify-start gap-4 pt-4"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.8, delay: 0.9 }}
                >
                  {[
                    { number: '10K+', label: 'Trips Planned', gradient: 'from-blue-600 to-cyan-500', borderColor: 'border-blue-500/20', hoverBorder: 'hover:border-blue-500/40', bgGradient: 'from-blue-500/20 to-cyan-500/20', delay: 0 },
                    { number: '150+', label: 'Countries', gradient: 'from-purple-600 to-pink-500', borderColor: 'border-purple-500/20', hoverBorder: 'hover:border-purple-500/40', bgGradient: 'from-purple-500/20 to-pink-500/20', delay: 0.1 },
                    { number: '4.9', label: 'User Rating', gradient: 'from-amber-500 to-orange-500', borderColor: 'border-amber-500/20', hoverBorder: 'hover:border-amber-500/40', bgGradient: 'from-amber-500/20 to-orange-500/20', delay: 0.2, star: true }
                  ].map((stat) => (
                    <motion.div
                      key={stat.label}
                      className="relative group"
                      initial={{ opacity: 0, scale: 0.8 }}
                      animate={{ opacity: 1, scale: 1 }}
                      transition={{ duration: 0.5, delay: 0.9 + stat.delay }}
                      whileHover={{ scale: 1.05 }}
                    >
                      <div className={`absolute inset-0 bg-gradient-to-r ${stat.bgGradient} rounded-xl blur-lg group-hover:blur-xl transition-all duration-300`}></div>
                      <div className={`relative bg-white/80 backdrop-blur-sm border ${stat.borderColor} rounded-xl px-4 py-3 ${stat.hoverBorder} transition-all duration-300`}>
                        <div className="flex items-center gap-1">
                          <div className={`text-3xl font-black bg-gradient-to-r ${stat.gradient} text-transparent bg-clip-text font-display`}>{stat.number}</div>
                          {stat.star && (
                            <svg className="w-6 h-6 text-amber-400 fill-current" viewBox="0 0 20 20">
                              <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                            </svg>
                          )}
                        </div>
                        <div className="text-xs text-gray-600 font-semibold mt-0.5">{stat.label}</div>
                      </div>
                    </motion.div>
                  ))}
                </motion.div>

                {/* CTA Buttons */}
                {session ? (
                  <motion.div
                    className="flex flex-col sm:flex-row gap-4 pt-4 w-full sm:w-auto"
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.8, delay: 1.2 }}
                  >
                    <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }} className="w-full sm:w-auto">
                      <Link
                        href="/plan/new"
                        className="group w-full sm:w-auto px-8 py-4 bg-gray-900 text-white rounded-2xl font-semibold text-base sm:text-lg hover:shadow-2xl hover:shadow-gray-900/30 transition-all duration-300 flex items-center justify-center"
                      >
                        Start Planning
                        <svg className="w-5 h-5 ml-2 group-hover:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
                        </svg>
                      </Link>
                    </motion.div>
                  </motion.div>
                ) : (
                  <motion.div
                    className="flex flex-col sm:flex-row gap-4 pt-4 w-full sm:w-auto"
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.8, delay: 1.2 }}
                  >
                    <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }} className="w-full sm:w-auto">
                      <Link
                        href="/register"
                        className="group w-full sm:w-auto px-8 py-4 bg-gray-900 text-white rounded-2xl font-semibold text-base sm:text-lg hover:shadow-2xl hover:shadow-gray-900/30 transition-all duration-300 flex items-center justify-center"
                      >
                        Get Started Free
                        <svg className="w-5 h-5 ml-2 group-hover:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
                        </svg>
                      </Link>
                    </motion.div>
                    <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }} className="w-full sm:w-auto">
                      <a
                        href="#destinations"
                        className="w-full sm:w-auto px-8 py-4 border-2 border-gray-900 text-gray-900 rounded-2xl font-semibold text-base sm:text-lg hover:bg-gray-50 transition-all duration-300 flex items-center justify-center"
                      >
                        Explore Destinations
                      </a>
                    </motion.div>
                  </motion.div>
                )}

                {/* Trust Indicators */}
                <div className="flex flex-wrap justify-center lg:justify-start gap-6 text-sm text-gray-500 pt-4">
                  <div className="flex items-center gap-2">
                    <svg className="w-5 h-5 text-emerald-500" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                    </svg>
                    <span>No credit card</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <svg className="w-5 h-5 text-emerald-500" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                    </svg>
                    <span>Free forever</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <svg className="w-5 h-5 text-emerald-500" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                    </svg>
                    <span>Instant results</span>
                  </div>
                </div>
              </div>

              {/* Right Visual - 5 columns - Creative Image Collage */}
              <div className="lg:col-span-5 relative h-[400px] sm:h-[500px] md:h-[600px] lg:h-[700px]">
                {/* Main Image */}
                <div className="absolute top-0 right-0 w-[85%] h-[55%] rounded-3xl overflow-hidden shadow-2xl transform rotate-2 hover:rotate-0 transition-transform duration-500">
                  <img
                    src="https://images.unsplash.com/photo-1613395877344-13d4a8e0d49e?w=800&h=600&fit=crop&q=80"
                    alt="Santorini Greece"
                    className="w-full h-full object-cover"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/20 to-transparent"></div>
                  <div className="absolute bottom-6 left-6 right-6">
                    <div className="text-white space-y-2">
                      <div className="text-xs font-semibold uppercase tracking-wider opacity-90">Featured</div>
                      <div className="text-2xl font-bold font-display">Santorini Sunsets</div>
                    </div>
                  </div>
                </div>

                {/* Small Overlapping Image 1 */}
                <div className="absolute top-[40%] left-0 w-[45%] h-[30%] rounded-2xl overflow-hidden shadow-xl transform -rotate-3 hover:-rotate-1 transition-transform duration-500 z-10">
                  <img
                    src="https://images.unsplash.com/photo-1537996194471-e657df975ab4?w=600&h=400&fit=crop&q=80"
                    alt="Bali Indonesia"
                    className="w-full h-full object-cover"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/20 to-transparent"></div>
                  <div className="absolute bottom-3 left-3 right-3">
                    <div className="text-white">
                      <div className="text-sm font-bold font-display">Bali Temples</div>
                    </div>
                  </div>
                </div>

                {/* Small Overlapping Image 2 */}
                <div className="absolute bottom-[15%] right-[10%] w-[55%] h-[28%] rounded-2xl overflow-hidden shadow-xl transform rotate-3 hover:rotate-1 transition-transform duration-500 z-20">
                  <img
                    src="https://images.unsplash.com/photo-1540959733332-eab4deabeeaf?w=700&h=400&fit=crop&q=80"
                    alt="Tokyo Japan"
                    className="w-full h-full object-cover"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/20 to-transparent"></div>
                  <div className="absolute bottom-3 left-3 right-3">
                    <div className="text-white">
                      <div className="text-sm font-bold font-display">Tokyo Nights</div>
                    </div>
                  </div>
                </div>

                {/* Floating Stats Card */}
                <div className="absolute bottom-0 left-[5%] bg-white rounded-2xl shadow-2xl p-5 transform -rotate-2 z-30 border border-gray-100">
                  <div className="flex items-center gap-4">
                    <div className="w-12 h-12 rounded-full bg-gradient-to-br from-blue-500 to-purple-500 flex items-center justify-center">
                      <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                      </svg>
                    </div>
                    <div>
                      <div className="text-2xl font-bold text-gray-900">20s</div>
                      <div className="text-xs text-gray-500 uppercase">Avg. Plan Time</div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Quick Preview Form - Floating at Bottom */}
        {!session && (
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-20 pb-12">
            <div className="bg-gradient-to-br from-gray-900 to-gray-800 rounded-3xl p-8 md:p-12 shadow-2xl relative overflow-hidden">
              {/* Decorative Elements */}
              <div className="absolute top-0 right-0 w-64 h-64 bg-gradient-to-br from-blue-500/20 to-purple-500/20 rounded-full blur-3xl"></div>
              <div className="absolute bottom-0 left-0 w-64 h-64 bg-gradient-to-tr from-pink-500/20 to-orange-500/20 rounded-full blur-3xl"></div>

              <div className="relative z-10">
                <div className="text-center mb-8">
                  <h3 className="text-3xl md:text-4xl font-bold text-white mb-3 font-display">
                    Try It Now
                  </h3>
                  <p className="text-gray-300 text-lg">
                    Get a taste of AI-powered planning — no signup required
                  </p>
                </div>

                <form onSubmit={handleTeaserSubmit} className="max-w-5xl mx-auto">
                  <div className="grid md:grid-cols-3 gap-4 mb-6">
                    <div className="md:col-span-1">
                      <SearchableSelect
                        id="teaserDestination"
                        label="Where to?"
                        value={teaserData.destination}
                        onChange={(value) => setTeaserData({ ...teaserData, destination: value })}
                        options={COUNTRIES.map((country) => ({ value: country, label: country }))}
                        placeholder="Search countries..."
                        required
                        dark={true}
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-300 mb-2">
                        Days
                      </label>
                      <select
                        value={teaserData.days}
                        onChange={(e) => setTeaserData({ ...teaserData, days: parseInt(e.target.value) })}
                        className="w-full px-4 py-3 bg-white/10 backdrop-blur-sm border border-white/20 rounded-xl text-white focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                      >
                        {[3, 5, 7, 10, 14, 21].map((days) => (
                          <option key={days} value={days} className="bg-gray-800">
                            {days} days
                          </option>
                        ))}
                      </select>
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-300 mb-2">
                        Style
                      </label>
                      <select
                        value={teaserData.budget}
                        onChange={(e) => setTeaserData({ ...teaserData, budget: e.target.value })}
                        className="w-full px-4 py-3 bg-white/10 backdrop-blur-sm border border-white/20 rounded-xl text-white focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                      >
                        <option value="budget" className="bg-gray-800">Budget</option>
                        <option value="moderate" className="bg-gray-800">Moderate</option>
                        <option value="luxury" className="bg-gray-800">Luxury</option>
                      </select>
                    </div>
                  </div>

                  <div className="mb-6">
                    <label className="block text-sm font-medium text-gray-300 mb-4 text-center">
                      What interests you? (Select all that apply)
                    </label>
                    <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-6 gap-3">
                      {[
                        { value: 'culture', label: 'Culture', icon: '🏛️' },
                        { value: 'adventure', label: 'Adventure', icon: '🏔️' },
                        { value: 'food', label: 'Food', icon: '🍜' },
                        { value: 'nature', label: 'Nature', icon: '🌿' },
                        { value: 'nightlife', label: 'Nightlife', icon: '🎉' },
                        { value: 'relaxation', label: 'Beach', icon: '🏖️' },
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
                          className={`flex flex-col items-center justify-center px-4 py-4 rounded-xl border-2 transition-all ${
                            teaserData.interests.includes(interest.value)
                              ? 'bg-white/20 border-white/40 scale-105 shadow-lg shadow-white/10'
                              : 'bg-white/5 border-white/20 hover:border-white/30 hover:bg-white/10'
                          }`}
                        >
                          <span className="text-3xl mb-2">{interest.icon}</span>
                          <span className="text-xs text-white font-medium">{interest.label}</span>
                        </button>
                      ))}
                    </div>
                  </div>

                  <button
                    type="submit"
                    disabled={loading || !teaserData.destination}
                    className="w-full px-8 py-4 bg-white text-gray-900 rounded-2xl font-bold text-lg hover:bg-gray-100 shadow-xl hover:shadow-2xl transition-all duration-300 hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    {loading ? (
                      <span className="flex items-center justify-center">
                        <svg className="animate-spin h-5 w-5 mr-3" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                        </svg>
                        Generating...
                      </span>
                    ) : (
                      'Generate Preview'
                    )}
                  </button>

                  <p className="text-center text-sm text-gray-400 mt-4">
                    See destinations, hidden gems & budget estimates instantly
                  </p>
                </form>
              </div>
            </div>
          </div>
        )}
      </section>

      {/* Popular Destinations - Creative Masonry Layout */}
      <section id="destinations" className="py-32 px-4 sm:px-6 lg:px-8 bg-gray-50 relative overflow-hidden">
        {/* Background decoration */}
        <div className="absolute top-0 left-0 w-96 h-96 bg-gradient-to-br from-blue-100 to-purple-100 rounded-full blur-3xl opacity-50"></div>

        <div className="max-w-7xl mx-auto relative z-10">
          <motion.div
            className="mb-20"
            initial={{ opacity: 0, y: 50 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-100px" }}
            transition={{ duration: 0.8 }}
          >
            <motion.div
              className="inline-block mb-4"
              initial={{ opacity: 0, x: -20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
            >
              <span className="px-4 py-2 bg-gray-900 text-white rounded-full text-sm font-semibold uppercase tracking-wider">
                Destinations
              </span>
            </motion.div>
            <motion.h2
              className="text-5xl md:text-7xl font-black text-gray-900 mb-6 max-w-3xl font-display"
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.8, delay: 0.2 }}
            >
              Where will your story begin?
            </motion.h2>
            <motion.p
              className="text-xl text-gray-600 max-w-2xl font-light"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.8, delay: 0.4 }}
            >
              From hidden gems to iconic landmarks — AI-curated experiences for every type of traveler
            </motion.p>
          </motion.div>

          {/* Asymmetric Grid */}
          <div className="grid grid-cols-12 gap-6 auto-rows-[280px]">
            {/* Large - Santorini */}
            <motion.div
              className="col-span-12 md:col-span-7 row-span-2"
              initial={{ opacity: 0, y: 50 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
            >
              <Link href={session ? "/plan/new" : "/register"} className="block h-full group relative overflow-hidden rounded-3xl cursor-pointer">
              <img
                src="https://images.unsplash.com/photo-1613395877344-13d4a8e0d49e?w=1000&h=800&fit=crop&q=80"
                alt="Santorini Greece"
                className="absolute inset-0 w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
              />
              <div className="absolute inset-0 bg-black/30 group-hover:bg-black/20 transition-colors"></div>
              <div className="absolute inset-0 p-8 md:p-12 flex flex-col justify-between">
                <div className="flex justify-between items-start">
                  <div className="bg-white/20 backdrop-blur-sm px-4 py-2 rounded-full">
                    <span className="text-white text-sm font-semibold">Most Popular</span>
                  </div>
                  <div className="bg-white/20 backdrop-blur-sm w-12 h-12 rounded-full flex items-center justify-center transform group-hover:rotate-45 transition-transform">
                    <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
                    </svg>
                  </div>
                </div>
                <div className="space-y-3">
                  <h3 className="text-4xl md:text-5xl font-bold text-white font-display">Santorini</h3>
                  <p className="text-white/90 text-lg max-w-md">Whitewashed villages perched on volcanic cliffs overlooking the Aegean Sea</p>
                  <div className="flex gap-2 flex-wrap">
                    <span className="px-3 py-1 bg-white/20 backdrop-blur-sm rounded-full text-white text-sm">Romantic</span>
                    <span className="px-3 py-1 bg-white/20 backdrop-blur-sm rounded-full text-white text-sm">Luxury</span>
                    <span className="px-3 py-1 bg-white/20 backdrop-blur-sm rounded-full text-white text-sm">Photography</span>
                  </div>
                </div>
              </div>
            </Link>
            </motion.div>

            {/* Medium - Tokyo */}
            <motion.div
              className="col-span-12 md:col-span-5 row-span-1"
              initial={{ opacity: 0, y: 50 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: 0.1 }}
            >
              <Link href={session ? "/plan/new" : "/register"} className="block h-full group relative overflow-hidden rounded-3xl cursor-pointer">
                <img
                  src="https://images.unsplash.com/photo-1540959733332-eab4deabeeaf?w=800&h=600&fit=crop&q=80"
                  alt="Tokyo Japan"
                  className="absolute inset-0 w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                />
                <div className="absolute inset-0 bg-black/30 group-hover:bg-black/20 transition-colors"></div>
                <div className="absolute inset-0 p-6 flex flex-col justify-end">
                  <h3 className="text-3xl font-bold text-white mb-2 font-display">Tokyo</h3>
                  <p className="text-white/90 text-sm">Neon-lit streets meet ancient temples</p>
                </div>
              </Link>
            </motion.div>

            {/* Medium - Bali */}
            <motion.div
              className="col-span-12 md:col-span-5 row-span-1"
              initial={{ opacity: 0, y: 50 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: 0.2 }}
            >
              <Link href={session ? "/plan/new" : "/register"} className="block h-full group relative overflow-hidden rounded-3xl cursor-pointer">
                <img
                  src="https://images.unsplash.com/photo-1537996194471-e657df975ab4?w=800&h=600&fit=crop&q=80"
                  alt="Bali Indonesia"
                  className="absolute inset-0 w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                />
                <div className="absolute inset-0 bg-black/30 group-hover:bg-black/20 transition-colors"></div>
                <div className="absolute inset-0 p-6 flex flex-col justify-end">
                  <h3 className="text-3xl font-bold text-white mb-2 font-display">Bali</h3>
                  <p className="text-white/90 text-sm">Tropical paradise with spiritual soul</p>
                </div>
              </Link>
            </motion.div>

            {/* Small - Paris */}
            <motion.div
              className="col-span-6 md:col-span-4 row-span-1"
              initial={{ opacity: 0, scale: 0.9 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: 0.3 }}
            >
              <Link href={session ? "/plan/new" : "/register"} className="block h-full group relative overflow-hidden rounded-3xl cursor-pointer">
                <img
                  src="https://images.unsplash.com/photo-1502602898657-3e91760cbb34?w=600&h=500&fit=crop&q=80"
                  alt="Paris France"
                  className="absolute inset-0 w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                />
                <div className="absolute inset-0 bg-black/30 group-hover:bg-black/20 transition-colors"></div>
                <div className="absolute inset-0 p-6 flex flex-col justify-end">
                  <h3 className="text-2xl font-bold text-white font-display">Paris</h3>
                </div>
              </Link>
            </motion.div>

            {/* Small - Maldives */}
            <motion.div
              className="col-span-6 md:col-span-4 row-span-1"
              initial={{ opacity: 0, scale: 0.9 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: 0.4 }}
            >
              <Link href={session ? "/plan/new" : "/register"} className="block h-full group relative overflow-hidden rounded-3xl cursor-pointer">
                <img
                  src="https://images.unsplash.com/photo-1514282401047-d79a71a590e8?w=600&h=500&fit=crop&q=80"
                  alt="Maldives"
                  className="absolute inset-0 w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                />
                <div className="absolute inset-0 bg-black/30 group-hover:bg-black/20 transition-colors"></div>
                <div className="absolute inset-0 p-6 flex flex-col justify-end">
                  <h3 className="text-2xl font-bold text-white font-display">Maldives</h3>
                </div>
              </Link>
            </motion.div>

            {/* Small - NYC */}
            <motion.div
              className="col-span-12 md:col-span-4 row-span-1"
              initial={{ opacity: 0, scale: 0.9 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: 0.5 }}
            >
              <Link href={session ? "/plan/new" : "/register"} className="block h-full group relative overflow-hidden rounded-3xl cursor-pointer">
                <img
                  src="https://images.unsplash.com/photo-1496442226666-8d4d0e62e6e9?w=700&h=500&fit=crop&q=80"
                  alt="New York City"
                  className="absolute inset-0 w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                />
                <div className="absolute inset-0 bg-black/30 group-hover:bg-black/20 transition-colors"></div>
                <div className="absolute inset-0 p-6 flex flex-col justify-end">
                  <h3 className="text-2xl font-bold text-white font-display">New York</h3>
                </div>
              </Link>
            </motion.div>
          </div>

          {/* View All */}
          <div className="mt-12 text-center">
            <Link href={session ? "/plan/new" : "/register"} className="group px-8 py-4 bg-transparent border-2 border-gray-900 text-gray-900 rounded-2xl font-semibold hover:bg-gray-900 hover:text-white transition-all duration-300 inline-flex items-center gap-2">
              View All 150+ Destinations
              <svg className="w-5 h-5 group-hover:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
              </svg>
            </Link>
          </div>
        </div>
      </section>

      {/* Features Section - Unique Layout */}
      <section id="features" className="py-32 px-4 sm:px-6 lg:px-8 relative bg-white">
        <div className="max-w-7xl mx-auto">
          <div className="grid lg:grid-cols-2 gap-20 items-center mb-20">
            <motion.div
              initial={{ opacity: 0, x: -50 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.8 }}
            >
              <motion.div
                className="inline-block mb-4"
                initial={{ opacity: 0, scale: 0.8 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5 }}
              >
                <span className="px-4 py-2 bg-emerald-100 text-emerald-700 rounded-full text-sm font-semibold uppercase tracking-wider">
                  Features
                </span>
              </motion.div>
              <h2 className="text-5xl md:text-6xl font-black text-gray-900 mb-6 font-display">
                Planning that feels like magic
              </h2>
              <p className="text-xl text-gray-600 font-light leading-relaxed">
                Every detail handled. Every preference honored. Every moment optimized. This is travel planning powered by GPT-4o.
              </p>
            </motion.div>

            {/* Featured Stat Card */}
            <motion.div
              className="bg-gradient-to-br from-gray-900 to-gray-800 rounded-3xl p-10 text-white relative overflow-hidden"
              initial={{ opacity: 0, x: 50 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.8 }}
              whileHover={{ scale: 1.02 }}
            >
              <div className="absolute top-0 right-0 w-64 h-64 bg-gradient-to-br from-blue-500/20 to-purple-500/20 rounded-full blur-3xl"></div>
              <div className="relative z-10">
                <div className="text-6xl font-black mb-4">20s</div>
                <div className="text-xl font-light mb-6">Average time to create a complete itinerary</div>
                <div className="flex gap-4 text-sm">
                  <div>
                    <div className="text-2xl font-bold">7-10</div>
                    <div className="text-gray-400">Day plans</div>
                  </div>
                  <div>
                    <div className="text-2xl font-bold">15+</div>
                    <div className="text-gray-400">Activities</div>
                  </div>
                  <div>
                    <div className="text-2xl font-bold">100%</div>
                    <div className="text-gray-400">Personalized</div>
                  </div>
                </div>
              </div>
            </motion.div>
          </div>

          {/* Feature Cards - Professional Layout */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {/* AI Itineraries - Featured */}
            <motion.div
              className="group relative md:col-span-2 lg:col-span-1 lg:row-span-2"
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5 }}
            >
              <div className="absolute inset-0 bg-gradient-to-br from-blue-500/10 to-cyan-500/10 rounded-3xl blur-xl group-hover:blur-2xl transition-all duration-500"></div>
              <div className="relative h-full p-10 bg-white rounded-3xl border border-gray-200 hover:border-blue-300 transition-all duration-500 hover:shadow-2xl overflow-hidden">
                <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-br from-blue-500/5 to-cyan-500/5 rounded-full blur-2xl"></div>
                <div className="relative">
                  <div className="w-20 h-20 bg-gradient-to-br from-blue-500 to-cyan-500 rounded-2xl flex items-center justify-center mb-6 shadow-lg shadow-blue-500/30 group-hover:scale-110 transition-transform duration-300">
                    <svg className="w-10 h-10 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                    </svg>
                  </div>
                  <h3 className="text-2xl font-bold text-gray-900 mb-3">AI Itineraries</h3>
                  <p className="text-gray-600 leading-relaxed mb-6">Comprehensive day-by-day plans with perfect timing and local insights. Our AI analyzes thousands of data points to create the perfect schedule.</p>
                  <div className="flex flex-wrap gap-2">
                    <span className="px-3 py-1 bg-blue-50 text-blue-700 rounded-full text-xs font-medium">Smart Scheduling</span>
                    <span className="px-3 py-1 bg-blue-50 text-blue-700 rounded-full text-xs font-medium">Local Insights</span>
                  </div>
                </div>
              </div>
            </motion.div>

            {/* Smart Budgeting */}
            <motion.div
              className="group relative"
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: 0.1 }}
            >
              <div className="absolute inset-0 bg-gradient-to-br from-purple-500/10 to-pink-500/10 rounded-2xl blur-xl group-hover:blur-2xl transition-all duration-500"></div>
              <div className="relative h-full p-8 bg-white rounded-2xl border border-gray-200 hover:border-purple-300 transition-all duration-500 hover:shadow-xl">
                <div className="w-16 h-16 bg-gradient-to-br from-purple-500 to-pink-500 rounded-xl flex items-center justify-center mb-5 shadow-lg shadow-purple-500/20 group-hover:scale-110 transition-transform duration-300">
                  <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 7h6m0 10v-3m-3 3h.01M9 17h.01M9 14h.01M12 14h.01M15 11h.01M12 11h.01M9 11h.01M7 21h10a2 2 0 002-2V5a2 2 0 00-2-2H7a2 2 0 00-2 2v14a2 2 0 002 2z" />
                  </svg>
                </div>
                <h3 className="text-xl font-bold text-gray-900 mb-2">Smart Budgeting</h3>
                <p className="text-gray-600 text-sm leading-relaxed">Visual charts, per-person splits, and daily estimates to keep you on track</p>
              </div>
            </motion.div>

            {/* Flight Intel */}
            <motion.div
              className="group relative"
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: 0.2 }}
            >
              <div className="absolute inset-0 bg-gradient-to-br from-emerald-500/10 to-teal-500/10 rounded-2xl blur-xl group-hover:blur-2xl transition-all duration-500"></div>
              <div className="relative h-full p-8 bg-white rounded-2xl border border-gray-200 hover:border-emerald-300 transition-all duration-500 hover:shadow-xl">
                <div className="w-16 h-16 bg-gradient-to-br from-emerald-500 to-teal-500 rounded-xl flex items-center justify-center mb-5 shadow-lg shadow-emerald-500/20 group-hover:scale-110 transition-transform duration-300">
                  <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 21v-4m0 0V5a2 2 0 012-2h6.5l1 1H21l-3 6 3 6h-8.5l-1-1H5a2 2 0 00-2 2zm9-13.5V9" />
                  </svg>
                </div>
                <h3 className="text-xl font-bold text-gray-900 mb-2">Flight Intel</h3>
                <p className="text-gray-600 text-sm leading-relaxed">Curated options with layover analysis and booking strategies</p>
              </div>
            </motion.div>

            {/* Hotel Picks */}
            <motion.div
              className="group relative"
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: 0.3 }}
            >
              <div className="absolute inset-0 bg-gradient-to-br from-orange-500/10 to-red-500/10 rounded-2xl blur-xl group-hover:blur-2xl transition-all duration-500"></div>
              <div className="relative h-full p-8 bg-white rounded-2xl border border-gray-200 hover:border-orange-300 transition-all duration-500 hover:shadow-xl">
                <div className="w-16 h-16 bg-gradient-to-br from-orange-500 to-red-500 rounded-xl flex items-center justify-center mb-5 shadow-lg shadow-orange-500/20 group-hover:scale-110 transition-transform duration-300">
                  <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
                  </svg>
                </div>
                <h3 className="text-xl font-bold text-gray-900 mb-2">Hotel Picks</h3>
                <p className="text-gray-600 text-sm leading-relaxed">AI-selected stays with location perks and vibe matching</p>
              </div>
            </motion.div>

            {/* Beautiful PDFs */}
            <motion.div
              className="group relative"
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: 0.4 }}
            >
              <div className="absolute inset-0 bg-gradient-to-br from-indigo-500/10 to-blue-500/10 rounded-2xl blur-xl group-hover:blur-2xl transition-all duration-500"></div>
              <div className="relative h-full p-8 bg-white rounded-2xl border border-gray-200 hover:border-indigo-300 transition-all duration-500 hover:shadow-xl">
                <div className="w-16 h-16 bg-gradient-to-br from-indigo-500 to-blue-500 rounded-xl flex items-center justify-center mb-5 shadow-lg shadow-indigo-500/20 group-hover:scale-110 transition-transform duration-300">
                  <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                  </svg>
                </div>
                <h3 className="text-xl font-bold text-gray-900 mb-2">Beautiful PDFs</h3>
                <p className="text-gray-600 text-sm leading-relaxed">Professionally designed guides for offline access</p>
              </div>
            </motion.div>

            {/* Real-Time Updates */}
            <motion.div
              className="group relative"
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: 0.5 }}
            >
              <div className="absolute inset-0 bg-gradient-to-br from-rose-500/10 to-pink-500/10 rounded-2xl blur-xl group-hover:blur-2xl transition-all duration-500"></div>
              <div className="relative h-full p-8 bg-white rounded-2xl border border-gray-200 hover:border-rose-300 transition-all duration-500 hover:shadow-xl">
                <div className="w-16 h-16 bg-gradient-to-br from-rose-500 to-pink-500 rounded-xl flex items-center justify-center mb-5 shadow-lg shadow-rose-500/20 group-hover:scale-110 transition-transform duration-300">
                  <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                </div>
                <h3 className="text-xl font-bold text-gray-900 mb-2">Real-Time Updates</h3>
                <p className="text-gray-600 text-sm leading-relaxed">Minute-by-minute timing with live schedule adjustments</p>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* How It Works - Simplified */}
      <section id="how-it-works" className="py-32 px-4 sm:px-6 lg:px-8 relative bg-gray-900 text-white overflow-hidden">
        {/* Background Pattern */}
        <div className="absolute inset-0 opacity-10">
          <div className="absolute inset-0" style={{backgroundImage: 'radial-gradient(circle at 2px 2px, white 1px, transparent 0)', backgroundSize: '40px 40px'}}></div>
        </div>

        <div className="max-w-6xl mx-auto relative z-10">
          <div className="text-center mb-20">
            <h2 className="text-5xl md:text-7xl font-black mb-6 font-display">
              Itinerary in 20 seconds
            </h2>
            <p className="text-2xl text-gray-400 font-light">
              No forms. No hassle. Just pure magic.
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8 max-w-4xl mx-auto">
            <div className="text-center space-y-4">
              <div className="w-20 h-20 bg-white rounded-full flex items-center justify-center mx-auto text-gray-900 font-black text-3xl">
                1
              </div>
              <h3 className="text-2xl font-bold font-display">Pick</h3>
              <p className="text-gray-400">Choose your destination</p>
            </div>

            <div className="text-center space-y-4">
              <div className="w-20 h-20 bg-gradient-to-br from-blue-500 to-purple-500 rounded-full flex items-center justify-center mx-auto">
                <svg className="w-10 h-10" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                </svg>
              </div>
              <h3 className="text-2xl font-bold font-display">Generate</h3>
              <p className="text-gray-400">AI creates your plan</p>
            </div>

            <div className="text-center space-y-4">
              <div className="w-20 h-20 bg-white rounded-full flex items-center justify-center mx-auto text-gray-900 font-black text-3xl">
                3
              </div>
              <h3 className="text-2xl font-bold font-display">Travel</h3>
              <p className="text-gray-400">Download & explore</p>
            </div>
          </div>

          <div className="mt-20 text-center">
            <Link
              href="/register"
              className="inline-flex items-center px-10 py-5 bg-white text-gray-900 rounded-2xl font-bold text-xl hover:shadow-2xl hover:scale-105 transition-all duration-300 shadow-xl"
            >
              Try It Now — It&apos;s Free
              <svg className="w-6 h-6 ml-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
              </svg>
            </Link>
            <p className="text-gray-500 mt-6">No signup required for preview • Full plan in 20 seconds</p>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-16 px-4 sm:px-6 lg:px-8 bg-gray-900 text-white">
        <div className="max-w-7xl mx-auto">
          <div className="grid md:grid-cols-12 gap-12 mb-12">
            <div className="md:col-span-5">
              <div className="flex items-center space-x-3 mb-6">
                <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-purple-500 rounded-xl flex items-center justify-center">
                  <svg className="w-7 h-7 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3.055 11H5a2 2 0 012 2v1a2 2 0 002 2 2 2 0 012 2v2.945M8 3.935V5.5A2.5 2.5 0 0010.5 8h.5a2 2 0 012 2 2 2 0 104 0 2 2 0 012-2h1.064M15 20.488V18a2 2 0 012-2h3.064M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                </div>
                <span className="text-3xl font-black font-display">AiTravello</span>
              </div>
              <p className="text-gray-400 max-w-sm text-lg font-light leading-relaxed">
                The future of travel planning. Powered by GPT-4o to create extraordinary journeys.
              </p>
            </div>

            <div className="md:col-span-7 grid sm:grid-cols-3 gap-8">
              <div>
                <h4 className="text-white font-bold mb-4 text-sm uppercase tracking-wider">Product</h4>
                <ul className="space-y-3">
                  <li><a href="#destinations" className="text-gray-400 hover:text-white transition-colors">Destinations</a></li>
                  <li><a href="#features" className="text-gray-400 hover:text-white transition-colors">Features</a></li>
                  <li><a href="#how-it-works" className="text-gray-400 hover:text-white transition-colors">How It Works</a></li>
                  <li><Link href="/dashboard" className="text-gray-400 hover:text-white transition-colors">Dashboard</Link></li>
                </ul>
              </div>
              <div>
                <h4 className="text-white font-bold mb-4 text-sm uppercase tracking-wider">Account</h4>
                <ul className="space-y-3">
                  <li><Link href="/login" className="text-gray-400 hover:text-white transition-colors">Sign In</Link></li>
                  <li><Link href="/register" className="text-gray-400 hover:text-white transition-colors">Get Started</Link></li>
                </ul>
              </div>
              <div>
                <h4 className="text-white font-bold mb-4 text-sm uppercase tracking-wider">Connect</h4>
                <div className="flex gap-3">
                  <a href="#" className="w-10 h-10 bg-white/10 hover:bg-white/20 rounded-lg flex items-center justify-center transition-colors">
                    <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24"><path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/></svg>
                  </a>
                  <a href="#" className="w-10 h-10 bg-white/10 hover:bg-white/20 rounded-lg flex items-center justify-center transition-colors">
                    <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24"><path d="M23.953 4.57a10 10 0 01-2.825.775 4.958 4.958 0 002.163-2.723c-.951.555-2.005.959-3.127 1.184a4.92 4.92 0 00-8.384 4.482C7.69 8.095 4.067 6.13 1.64 3.162a4.822 4.822 0 00-.666 2.475c0 1.71.87 3.213 2.188 4.096a4.904 4.904 0 01-2.228-.616v.06a4.923 4.923 0 003.946 4.827 4.996 4.996 0 01-2.212.085 4.936 4.936 0 004.604 3.417 9.867 9.867 0 01-6.102 2.105c-.39 0-.779-.023-1.17-.067a13.995 13.995 0 007.557 2.209c9.053 0 13.998-7.496 13.998-13.985 0-.21 0-.42-.015-.63A9.935 9.935 0 0024 4.59z"/></svg>
                  </a>
                </div>
              </div>
            </div>
          </div>

          <div className="border-t border-white/10 pt-8 flex flex-col sm:flex-row justify-between items-center gap-4">
            <p className="text-gray-500 text-sm">&copy; 2024 AiTravello. All rights reserved.</p>
            <div className="flex gap-6 text-sm text-gray-500">
              <Link href="/privacy" className="hover:text-white transition-colors">Privacy</Link>
              <Link href="/terms" className="hover:text-white transition-colors">Terms</Link>
            </div>
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
            <span className="text-2xl font-bold bg-gradient-to-r from-blue-600 to-cyan-500 text-transparent bg-clip-text">
              {teaserData.destination} Awaits You
            </span>
          </div>
        }
      >
        {preview && (
          <div className="space-y-6">
            {/* Hero stats */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="bg-gradient-to-br from-blue-500/10 to-blue-600/10 border-2 border-blue-500/30 rounded-2xl p-6 text-center hover:shadow-lg hover:shadow-blue-500/20 transition-all duration-300">
                <div className="text-4xl font-black text-gray-900 mb-2 font-display">{preview.estimatedCost}</div>
                <div className="text-sm font-semibold text-blue-700 uppercase tracking-wide">Estimated Budget</div>
              </div>
              <div className="bg-gradient-to-br from-cyan-500/10 to-cyan-600/10 border-2 border-cyan-500/30 rounded-2xl p-6 text-center hover:shadow-lg hover:shadow-cyan-500/20 transition-all duration-300">
                <div className="text-base font-bold text-gray-900 mb-2 leading-tight">{preview.bestTimeToVisit}</div>
                <div className="text-sm font-semibold text-cyan-700 uppercase tracking-wide">Best Time to Visit</div>
              </div>
            </div>

            {/* Teaser notice */}
            <div className="relative bg-gradient-to-r from-blue-500/10 via-cyan-500/10 to-blue-500/10 border border-blue-500/30 rounded-xl p-4 overflow-hidden">
              <div className="absolute top-0 right-0 w-20 h-20 bg-blue-500/20 rounded-full blur-2xl"></div>
              <div className="relative flex items-start">
                <div className="flex-shrink-0">
                  <svg className="w-6 h-6 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                </div>
                <div className="ml-3 flex-1">
                  <p className="text-sm font-medium text-blue-900 mb-1">
                    This is just a sneak peek!
                  </p>
                  <p className="text-xs text-blue-700">
                    The full itinerary includes day-by-day schedules, flight options, hotel recommendations, activity bookings, and a downloadable PDF guide.
                  </p>
                </div>
              </div>
            </div>

            <div className="grid md:grid-cols-2 gap-4">
              {/* Highlights */}
              <div className="bg-blue-50 border border-blue-200 rounded-xl p-5">
                <h3 className="text-base font-bold text-gray-900 mb-4 flex items-center">
                  <svg className="w-5 h-5 mr-2 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 3v4M3 5h4M6 17v4m-2-2h4m5-16l2.286 6.857L21 12l-5.714 2.143L13 21l-2.286-6.857L5 12l5.714-2.143L13 3z" />
                  </svg>
                  Trip Highlights
                </h3>
                <ul className="space-y-2.5">
                  {preview.highlights.map((highlight, idx) => (
                    <li key={idx} className="flex items-start text-sm text-gray-700 leading-snug">
                      <svg className="w-4 h-4 text-green-500 mr-2 mt-0.5 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                      </svg>
                      <span className="text-left">{highlight}</span>
                    </li>
                  ))}
                </ul>
              </div>

              {/* Must-See */}
              <div className="bg-cyan-50 border border-cyan-200 rounded-xl p-5">
                <h3 className="text-base font-bold text-gray-900 mb-4 flex items-center">
                  <svg className="w-5 h-5 mr-2 text-cyan-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                  </svg>
                  Must-See Places
                </h3>
                <ul className="space-y-2.5">
                  {preview.mustSee.slice(0, 4).map((place, idx) => (
                    <li key={idx} className="flex items-start text-sm text-gray-700 leading-snug">
                      <svg className="w-4 h-4 text-cyan-600 mr-2 mt-0.5 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M5.05 4.05a7 7 0 119.9 9.9L10 18.9l-4.95-4.95a7 7 0 010-9.9zM10 11a2 2 0 100-4 2 2 0 000 4z" clipRule="evenodd" />
                      </svg>
                      <span className="text-left">{place}</span>
                    </li>
                  ))}
                  {preview.mustSee.length > 4 && (
                    <li className="text-xs text-blue-600 font-medium pl-6 pt-1 text-left">
                      + {preview.mustSee.length - 4} more iconic locations in full plan
                    </li>
                  )}
                </ul>
              </div>
            </div>

            {/* Hidden Gems - Curiosity Driver */}
            <div className="bg-gradient-to-br from-amber-500/10 to-orange-500/10 border-2 border-amber-500/30 rounded-xl p-5 relative overflow-hidden">
              <div className="absolute top-0 right-0 w-32 h-32 bg-amber-500/20 rounded-full blur-3xl"></div>
              <div className="relative">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-base font-bold text-gray-900 flex items-center">
                    <svg className="w-5 h-5 mr-2 text-amber-700" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 11c0 3.517-1.009 6.799-2.753 9.571m-3.44-2.04l.054-.09A13.916 13.916 0 008 11a4 4 0 118 0c0 1.017-.07 2.019-.203 3m-2.118 6.844A21.88 21.88 0 0015.171 17m3.839 1.132c.645-2.266.99-4.659.99-7.132A8 8 0 008 4.07M3 15.364c.64-1.319 1-2.8 1-4.364 0-1.457.39-2.823 1.07-4" />
                    </svg>
                    Local Hidden Gems
                    <span className="ml-2 px-2 py-0.5 bg-amber-500/20 text-amber-900 text-xs font-bold rounded-full">Secret Spots</span>
                  </h3>
                </div>
                <ul className="space-y-2.5 mb-4">
                  {preview.hiddenGems.map((gem, idx) => (
                    <li key={idx} className="flex items-start text-sm text-gray-800 leading-snug">
                      <svg className="w-4 h-4 text-amber-600 mr-2 mt-0.5 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                        <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                      </svg>
                      <span className="text-left">{gem}</span>
                    </li>
                  ))}
                </ul>
                <p className="text-xs text-gray-700 italic">
                  These are places most tourists never discover. Want to know more insider secrets?
                </p>
              </div>
            </div>

            {/* Budget Tip */}
            <div className="bg-gradient-to-r from-green-500/10 to-emerald-500/10 border border-green-500/30 rounded-xl p-4">
              <h3 className="text-sm font-bold text-gray-900 mb-2 flex items-center">
                <svg className="w-5 h-5 mr-2 text-green-700" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                Pro Budget Tip
              </h3>
              <p className="text-sm text-gray-800">{preview.budgetTip}</p>
            </div>

            {/* What's Missing Tease */}
            <div className="bg-gradient-to-r from-slate-700/60 to-slate-600/60 border border-slate-500/40 rounded-xl p-5">
              <h3 className="text-sm font-bold text-white mb-3">
                What you&apos;ll get in the full itinerary:
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
                  <div key={idx} className="flex items-start text-gray-100">
                    <span className="mr-2 text-base flex-shrink-0">{item.icon}</span>
                    <span className="text-left">{item.text}</span>
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
                className="shadow-xl shadow-blue-500/30"
              >
                <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                </svg>
                Create My Complete Itinerary - Free
              </Button>
              <p className="text-xs text-center text-gray-500">
                No credit card required • Free plan available • Takes 60 seconds
              </p>
            </div>
          </div>
        )}
      </Modal>
    </div>
  );
}
