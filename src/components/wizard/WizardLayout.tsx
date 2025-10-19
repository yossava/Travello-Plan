'use client';

import { ReactNode } from 'react';
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
  const steps = [
    { number: 1, name: 'Trip Details' },
    { number: 2, name: 'Preferences' },
    { number: 3, name: 'Review' },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 py-8 relative">
      {/* Animated background elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-1/4 right-1/3 w-96 h-96 bg-purple-500/10 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute bottom-1/3 left-1/4 w-96 h-96 bg-pink-500/10 rounded-full blur-3xl animate-pulse" style={{animationDelay: '1s'}}></div>
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
                          ? 'border-purple-500 bg-gradient-to-br from-purple-500 to-pink-500 shadow-lg shadow-purple-500/50'
                          : step.number === currentStep
                          ? 'border-purple-500 bg-white/10 backdrop-blur-xl shadow-lg shadow-purple-500/30'
                          : 'border-white/20 bg-white/5 backdrop-blur-xl'
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
                              ? 'text-purple-300'
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
                          ? 'text-purple-300'
                          : step.number < currentStep
                          ? 'text-white'
                          : 'text-gray-400'
                      }`}
                    >
                      {step.name}
                    </span>
                  </div>
                  {stepIdx !== steps.length - 1 && (
                    <div
                      className={`flex-1 h-0.5 mx-6 transition-all duration-300 ${
                        step.number < currentStep
                          ? 'bg-gradient-to-r from-purple-500 to-pink-500'
                          : 'bg-white/20'
                      }`}
                    />
                  )}
                </div>
              </li>
            ))}
          </ol>
        </nav>

        {/* Content */}
        <div className="bg-white/10 backdrop-blur-xl border border-white/20 shadow-2xl rounded-3xl p-8 mb-6">
          {children}
        </div>

        {/* Navigation Buttons */}
        <div className="flex justify-between items-center">
          <div>
            {currentStep > 1 && (
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
