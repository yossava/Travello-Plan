'use client';

import { ReactNode } from 'react';
import { useRouter } from 'next/navigation';
import Button from '@/components/ui/Button';

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
  const router = useRouter();
  const steps = [
    { number: 1, name: 'Trip Details' },
    { number: 2, name: 'Preferences' },
    { number: 3, name: 'Review' },
  ];

  const handleCancel = () => {
    router.push('/dashboard');
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-blue-50 to-purple-50 py-8 relative">
      {/* Animated background elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-1/4 right-1/3 w-96 h-96 bg-blue-200/20 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute bottom-1/3 left-1/4 w-96 h-96 bg-purple-200/20 rounded-full blur-3xl animate-pulse" style={{animationDelay: '1s'}}></div>
      </div>

      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
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
                      className={`flex items-center justify-center w-12 h-12 rounded-xl border-2 transition-all duration-300 ${
                        step.number < currentStep
                          ? 'border-blue-500 bg-gradient-to-br from-blue-600 to-cyan-500 shadow-lg shadow-blue-500/30'
                          : step.number === currentStep
                          ? 'border-blue-500 bg-white shadow-lg'
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
                          className={`text-sm font-bold ${
                            step.number === currentStep
                              ? 'text-blue-600'
                              : 'text-gray-400'
                          }`}
                        >
                          {step.number}
                        </span>
                      )}
                    </div>
                    <span
                      className={`ml-3 text-sm font-semibold whitespace-nowrap ${
                        step.number === currentStep
                          ? 'text-blue-600'
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
                      className={`flex-1 h-0.5 mx-6 transition-all duration-300 ${
                        step.number < currentStep
                          ? 'bg-gradient-to-r from-blue-600 to-cyan-500'
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
        <div className="bg-white border border-gray-200 shadow-xl rounded-3xl p-8 mb-6">
          {children}
        </div>

        {/* Navigation Buttons */}
        <div className="flex justify-between items-center">
          <div>
            {currentStep > 1 ? (
              <Button
                variant="secondary"
                onClick={onBack}
                leftIcon={
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                  </svg>
                }
              >
                Back
              </Button>
            ) : (
              <Button
                variant="secondary"
                onClick={handleCancel}
                leftIcon={
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
                  </svg>
                }
              >
                Back to Dashboard
              </Button>
            )}
          </div>

          <div className="flex space-x-3">
            {showSaveDraft && onSaveDraft && (
              <Button
                variant="outline"
                onClick={onSaveDraft}
              >
                Save as Draft
              </Button>
            )}
            {currentStep < totalSteps && onNext && (
              <Button
                variant="gradient"
                onClick={onNext}
                disabled={nextDisabled}
                rightIcon={
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                  </svg>
                }
              >
                {nextLabel}
              </Button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
