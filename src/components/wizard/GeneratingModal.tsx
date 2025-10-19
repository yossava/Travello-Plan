'use client';

import { useEffect, useState } from 'react';
import Spinner from '@/components/ui/Spinner';

interface GeneratingModalProps {
  isOpen: boolean;
}

const PROGRESS_MESSAGES = [
  'Analyzing your preferences...',
  'Finding the best flight routes...',
  'Selecting perfect accommodations...',
  'Creating your personalized itinerary...',
  'Calculating budget breakdown...',
  'Almost done...',
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
    <div className="fixed z-50 inset-0 overflow-y-auto">
      <div className="flex items-center justify-center min-h-screen pt-4 px-4 pb-20 text-center sm:block sm:p-0">
        {/* Background overlay */}
        <div className="fixed inset-0 bg-gray-500 bg-opacity-75 transition-opacity"></div>

        {/* Center modal */}
        <span
          className="hidden sm:inline-block sm:align-middle sm:h-screen"
          aria-hidden="true"
        >
          &#8203;
        </span>

        <div className="inline-block align-bottom bg-white rounded-lg px-4 pt-5 pb-4 text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle sm:max-w-sm sm:w-full sm:p-6">
          <div>
            <div className="mx-auto flex items-center justify-center h-20 w-20 rounded-full bg-primary-100 mb-4">
              <Spinner size="lg" />
            </div>
            <div className="mt-3 text-center sm:mt-5">
              <h3 className="text-lg leading-6 font-medium text-gray-900 mb-2">
                Creating Your Itinerary
              </h3>
              <div className="mt-2">
                <p className="text-sm text-gray-500 min-h-[40px] flex items-center justify-center">
                  {PROGRESS_MESSAGES[messageIndex]}
                </p>
              </div>
              <div className="mt-4">
                <div className="flex space-x-1 justify-center">
                  {PROGRESS_MESSAGES.map((_, idx) => (
                    <div
                      key={idx}
                      className={`h-1.5 w-8 rounded-full transition-colors ${
                        idx <= messageIndex ? 'bg-primary-600' : 'bg-gray-200'
                      }`}
                    />
                  ))}
                </div>
              </div>
              <p className="mt-4 text-xs text-gray-400">
                This may take 20-30 seconds...
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
