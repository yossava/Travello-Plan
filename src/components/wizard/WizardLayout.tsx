'use client';

import { ReactNode } from 'react';

interface WizardLayoutProps {
  currentStep: number;
  totalSteps: number;
  onBack?: () => void;
  onNext?: () => void;
  onSaveDraft?: () => void;
  children: ReactNode;
  nextDisabled?: boolean;
  nextLabel?: string;
  showSaveDraft?: boolean;
}

export default function WizardLayout({
  currentStep,
  totalSteps,
  onBack,
  onNext,
  onSaveDraft,
  children,
  nextDisabled = false,
  nextLabel = 'Next',
  showSaveDraft = false,
}: WizardLayoutProps) {
  const steps = [
    { number: 1, name: 'Trip Details' },
    { number: 2, name: 'Preferences' },
    { number: 3, name: 'Review' },
  ];

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Progress Steps */}
        <nav aria-label="Progress" className="mb-8">
          <ol className="flex items-center">
            {steps.map((step, stepIdx) => (
              <li
                key={step.number}
                className={`${
                  stepIdx !== steps.length - 1 ? 'flex-1' : ''
                } relative`}
              >
                <div className="flex items-center">
                  <div className="flex items-center">
                    <div
                      className={`flex items-center justify-center w-10 h-10 rounded-full border-2 ${
                        step.number < currentStep
                          ? 'border-primary-600 bg-primary-600'
                          : step.number === currentStep
                          ? 'border-primary-600 bg-white'
                          : 'border-gray-300 bg-white'
                      }`}
                    >
                      {step.number < currentStep ? (
                        <svg
                          className="w-6 h-6 text-white"
                          fill="currentColor"
                          viewBox="0 0 20 20"
                        >
                          <path
                            fillRule="evenodd"
                            d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                            clipRule="evenodd"
                          />
                        </svg>
                      ) : (
                        <span
                          className={`text-sm font-medium ${
                            step.number === currentStep
                              ? 'text-primary-600'
                              : 'text-gray-500'
                          }`}
                        >
                          {step.number}
                        </span>
                      )}
                    </div>
                    <span
                      className={`ml-2 text-sm font-medium ${
                        step.number === currentStep
                          ? 'text-primary-600'
                          : step.number < currentStep
                          ? 'text-gray-900'
                          : 'text-gray-500'
                      }`}
                    >
                      {step.name}
                    </span>
                  </div>
                  {stepIdx !== steps.length - 1 && (
                    <div
                      className={`flex-1 h-0.5 mx-4 ${
                        step.number < currentStep
                          ? 'bg-primary-600'
                          : 'bg-gray-300'
                      }`}
                    />
                  )}
                </div>
              </li>
            ))}
          </ol>
        </nav>

        {/* Content */}
        <div className="bg-white shadow rounded-lg p-6 mb-6">{children}</div>

        {/* Navigation Buttons */}
        <div className="flex justify-between items-center">
          <div>
            {currentStep > 1 && (
              <button
                type="button"
                onClick={onBack}
                className="inline-flex items-center px-4 py-2 border border-gray-300 shadow-sm text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500"
              >
                <svg
                  className="mr-2 -ml-1 h-5 w-5"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M15 19l-7-7 7-7"
                  />
                </svg>
                Back
              </button>
            )}
          </div>

          <div className="flex space-x-3">
            {showSaveDraft && onSaveDraft && (
              <button
                type="button"
                onClick={onSaveDraft}
                className="inline-flex items-center px-4 py-2 border border-gray-300 shadow-sm text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500"
              >
                Save as Draft
              </button>
            )}
            {currentStep < totalSteps && onNext && (
              <button
                type="button"
                onClick={onNext}
                disabled={nextDisabled}
                className="inline-flex items-center px-4 py-2 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-primary-600 hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {nextLabel}
                <svg
                  className="ml-2 -mr-1 h-5 w-5"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M9 5l7 7-7 7"
                  />
                </svg>
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
