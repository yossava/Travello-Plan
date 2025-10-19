'use client';

import { useEffect, useState } from 'react';
import Spinner from '@/components/ui/Spinner';

interface GeneratingModalProps {
  isOpen: boolean;
}

const PROGRESS_MESSAGES = [
  'Analyzing your travel preferences...',
  'Searching for the best flight options...',
  'Finding perfect accommodations...',
  'Planning your daily activities...',
  'Optimizing your itinerary...',
  'Calculating budget breakdown...',
  'Gathering essential travel information...',
  'Finalizing your personalized plan...',
  'Almost ready...',
];

export default function GeneratingModal({ isOpen }: GeneratingModalProps) {
  const [messageIndex, setMessageIndex] = useState(0);

  useEffect(() => {
    if (!isOpen) {
      setMessageIndex(0);
      return;
    }

    const interval = setInterval(() => {
      setMessageIndex((prev) => {
        if (prev < PROGRESS_MESSAGES.length - 1) {
          return prev + 1;
        }
        return prev;
      });
    }, 4000); // Change message every 4 seconds

    return () => clearInterval(interval);
  }, [isOpen]);

  if (!isOpen) return null;

  return (
    <div
      className="fixed z-50 inset-0 overflow-y-auto"
      role="dialog"
      aria-modal="true"
      aria-labelledby="generating-title"
    >
      <div className="flex items-center justify-center min-h-screen pt-4 px-4 pb-20 text-center sm:block sm:p-0">
        {/* Background overlay */}
        <div
          className="fixed inset-0 bg-slate-900/90 backdrop-blur-sm transition-opacity"
          aria-hidden="true"
        ></div>

        {/* Center modal */}
        <span
          className="hidden sm:inline-block sm:align-middle sm:h-screen"
          aria-hidden="true"
        >
          &#8203;
        </span>

        <div className="inline-block align-bottom bg-white/10 backdrop-blur-xl border border-white/20 rounded-3xl px-4 pt-5 pb-4 text-left overflow-hidden shadow-2xl transform transition-all sm:my-8 sm:align-middle sm:max-w-sm sm:w-full sm:p-8">
          <div>
            {/* Animated spinner container */}
            <div className="mx-auto flex items-center justify-center h-24 w-24 rounded-2xl bg-gradient-to-br from-purple-500/20 to-pink-500/20 border border-purple-500/30 mb-6">
              <Spinner size="lg" />
            </div>

            <div className="mt-3 text-center sm:mt-5">
              <h3
                id="generating-title"
                className="text-2xl leading-6 font-bold text-white mb-4"
              >
                Creating Your Itinerary
              </h3>
              <div className="mt-4">
                <p
                  className="text-base text-purple-200 min-h-[48px] flex items-center justify-center font-medium"
                  aria-live="polite"
                  aria-atomic="true"
                >
                  {PROGRESS_MESSAGES[messageIndex]}
                </p>
              </div>

              {/* Progress dots */}
              <div className="mt-6">
                <div className="flex space-x-2 justify-center">
                  {PROGRESS_MESSAGES.map((_, idx) => (
                    <div
                      key={idx}
                      className={`h-2 w-10 rounded-full transition-all duration-500 ${
                        idx <= messageIndex
                          ? 'bg-gradient-to-r from-purple-500 to-pink-500 shadow-lg shadow-purple-500/50'
                          : 'bg-white/20'
                      }`}
                    />
                  ))}
                </div>
              </div>

              <p className="mt-6 text-sm text-gray-400">
                This may take 30-60 seconds. We&apos;re creating a detailed, personalized itinerary just for you...
              </p>
              <p className="mt-2 text-xs text-gray-500">
                Using AI to generate flights, accommodations, daily activities, and travel tips
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
