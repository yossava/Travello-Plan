'use client';

import { useState } from 'react';
import EditActivityModal from './EditActivityModal';

interface Activity {
  time: string;
  type: string;
  title: string;
  description: string;
  location: string;
  address?: string;
  duration: string;
  cost: number;
  openingHours?: string;
  travelTimeToNext?: string;
  notes?: string;
}

interface DayItinerary {
  day: number;
  date: string;
  theme?: string;
  weather?: string;
  activities: Activity[];
  dailyTotal: number;
}

interface DailyItinerarySectionProps {
  dailyItinerary: DayItinerary[];
  currency: string;
  onUpdateActivity?: (dayIndex: number, activityIndex: number, updatedActivity: Activity) => void;
  editable?: boolean;
}

export default function DailyItinerarySection({
  dailyItinerary,
  currency,
  onUpdateActivity,
  editable = false,
}: DailyItinerarySectionProps) {
  const [expandedDays, setExpandedDays] = useState<Set<number>>(
    new Set([1]) // Expand first day by default
  );
  const [editingActivity, setEditingActivity] = useState<{
    dayIndex: number;
    activityIndex: number;
    activity: Activity;
  } | null>(null);

  const toggleDay = (day: number) => {
    const newExpanded = new Set(expandedDays);
    if (newExpanded.has(day)) {
      newExpanded.delete(day);
    } else {
      newExpanded.add(day);
    }
    setExpandedDays(newExpanded);
  };

  const handleEditClick = (dayIndex: number, activityIndex: number, activity: Activity) => {
    setEditingActivity({ dayIndex, activityIndex, activity });
  };

  const handleSaveActivity = (updatedActivity: Activity) => {
    if (editingActivity && onUpdateActivity) {
      onUpdateActivity(editingActivity.dayIndex, editingActivity.activityIndex, updatedActivity);
    }
    setEditingActivity(null);
  };

  const getActivityIcon = (type: string) => {
    switch (type.toLowerCase()) {
      case 'breakfast':
      case 'lunch':
      case 'dinner':
      case 'food':
        return (
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z"
          />
        );
      case 'attraction':
      case 'sightseeing':
        return (
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M3 9a2 2 0 012-2h.93a2 2 0 001.664-.89l.812-1.22A2 2 0 0110.07 4h3.86a2 2 0 011.664.89l.812 1.22A2 2 0 0018.07 7H19a2 2 0 012 2v9a2 2 0 01-2 2H5a2 2 0 01-2-2V9z"
          />
        );
      case 'activity':
      case 'adventure':
        return (
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M13 10V3L4 14h7v7l9-11h-7z"
          />
        );
      case 'shopping':
        return (
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z"
          />
        );
      default:
        return (
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
          />
        );
    }
  };

  return (
    <div className="space-y-4">
      {dailyItinerary.map((day) => (
        <div key={day.day} className="bg-white rounded-lg shadow overflow-hidden">
          {/* Day Header */}
          <button
            onClick={() => toggleDay(day.day)}
            className="w-full px-6 py-4 flex items-center justify-between hover:bg-gray-50 transition-colors"
          >
            <div className="flex items-center space-x-4">
              <div className="flex-shrink-0 w-12 h-12 bg-primary-100 rounded-full flex items-center justify-center">
                <span className="text-lg font-bold text-primary-600">
                  {day.day}
                </span>
              </div>
              <div className="text-left">
                <h3 className="text-lg font-semibold text-gray-900">
                  Day {day.day}
                  {day.theme && ` - ${day.theme}`}
                </h3>
                <p className="text-sm text-gray-600">
                  {new Date(day.date).toLocaleDateString('en-US', {
                    weekday: 'long',
                    month: 'long',
                    day: 'numeric',
                  })}
                  {day.weather && ` • ${day.weather}`}
                </p>
              </div>
            </div>
            <div className="flex items-center space-x-4">
              <div className="text-right">
                <div className="text-sm text-gray-500">
                  {day.activities.length} activities
                </div>
                <div className="font-semibold text-primary-600">
                  {currency} {day.dailyTotal.toLocaleString()}
                </div>
              </div>
              <svg
                className={`w-5 h-5 text-gray-400 transform transition-transform ${
                  expandedDays.has(day.day) ? 'rotate-180' : ''
                }`}
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M19 9l-7 7-7-7"
                />
              </svg>
            </div>
          </button>

          {/* Day Activities */}
          {expandedDays.has(day.day) && (
            <div className="border-t border-gray-200 px-3 sm:px-6 py-3 sm:py-4">
              <div className="space-y-6">
                {day.activities.map((activity, idx) => (
                  <div key={idx} className="relative">
                    {/* Timeline connector */}
                    {idx < day.activities.length - 1 && (
                      <div className="absolute left-5 sm:left-6 top-14 bottom-0 w-0.5 bg-gray-200"></div>
                    )}

                    {/* Mobile: Time above card */}
                    <div className="sm:hidden mb-2 pl-0.5">
                      <div className="text-sm font-bold text-gray-900">
                        {activity.time}
                      </div>
                    </div>

                    <div className="flex gap-3 sm:gap-0">
                      {/* Desktop Time */}
                      <div className="hidden sm:block flex-shrink-0 w-24">
                        <div className="text-sm font-semibold text-gray-900">
                          {activity.time}
                        </div>
                      </div>

                      {/* Activity Icon */}
                      <div className="flex-shrink-0 w-10 h-10 sm:w-12 sm:h-12 bg-primary-50 rounded-full flex items-center justify-center sm:mr-4 relative z-10">
                        <svg
                          className="w-5 h-5 sm:w-6 sm:h-6 text-primary-600"
                          fill="none"
                          stroke="currentColor"
                          viewBox="0 0 24 24"
                        >
                          {getActivityIcon(activity.type)}
                        </svg>
                      </div>

                      {/* Activity Details */}
                      <div className="flex-1 pb-4 sm:pb-6">
                        <div className="bg-gray-50 rounded-lg p-4 sm:p-4">
                          <div className="flex justify-between items-start mb-2 gap-2">
                            <div className="flex-1 min-w-0">
                              <h4 className="font-semibold text-gray-900 text-sm sm:text-base leading-tight">
                                {activity.title}
                              </h4>
                              <p className="text-xs sm:text-sm text-gray-600 mt-0.5">
                                {activity.type}
                              </p>
                            </div>
                            <div className="flex items-center space-x-1 sm:space-x-2 flex-shrink-0">
                              {activity.cost > 0 && (
                                <span className="inline-flex items-center px-2 sm:px-2.5 py-0.5 rounded-full text-xs font-medium bg-primary-100 text-primary-800 whitespace-nowrap">
                                  {currency} {activity.cost.toLocaleString()}
                                </span>
                              )}
                              {editable && (
                                <button
                                  onClick={() => handleEditClick(day.day - 1, idx, activity)}
                                  className="p-1 text-gray-400 hover:text-primary-600 transition-colors"
                                  title="Edit activity"
                                >
                                  <svg
                                    className="w-4 h-4 sm:w-5 sm:h-5"
                                    fill="none"
                                    stroke="currentColor"
                                    viewBox="0 0 24 24"
                                  >
                                    <path
                                      strokeLinecap="round"
                                      strokeLinejoin="round"
                                      strokeWidth={2}
                                      d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"
                                    />
                                  </svg>
                                </button>
                              )}
                            </div>
                          </div>

                          <p className="text-xs sm:text-sm text-gray-700 mb-2 sm:mb-3 leading-relaxed">
                            {activity.description}
                          </p>

                          <div className="space-y-2 text-xs sm:text-sm">
                            <div className="flex items-start gap-1.5">
                              <svg
                                className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-gray-400 mt-0.5 flex-shrink-0"
                                fill="none"
                                stroke="currentColor"
                                viewBox="0 0 24 24"
                              >
                                <path
                                  strokeLinecap="round"
                                  strokeLinejoin="round"
                                  strokeWidth={2}
                                  d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"
                                />
                              </svg>
                              <span className="text-gray-600 break-words leading-snug">
                                {activity.location}
                              </span>
                            </div>

                            <div className="flex items-center gap-1.5">
                              <svg
                                className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-gray-400 flex-shrink-0"
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
                              <span className="text-gray-600">
                                {activity.duration}
                                {activity.openingHours && ` • ${activity.openingHours}`}
                              </span>
                            </div>

                            {activity.address && (
                              <div className="flex items-start gap-1.5">
                                <svg
                                  className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-gray-400 mt-0.5 flex-shrink-0"
                                  fill="none"
                                  stroke="currentColor"
                                  viewBox="0 0 24 24"
                                >
                                  <path
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                    strokeWidth={2}
                                    d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                                  />
                                </svg>
                                <span className="text-gray-500 text-xs leading-snug">
                                  {activity.address}
                                </span>
                              </div>
                            )}
                          </div>

                          {activity.notes && (
                            <div className="mt-2 sm:mt-3 text-xs text-gray-600 bg-white rounded p-2 border border-gray-200 leading-relaxed">
                              <span className="font-semibold">Note: </span>
                              {activity.notes}
                            </div>
                          )}

                          {activity.travelTimeToNext && (
                            <div className="mt-2 sm:mt-3 flex items-center text-xs text-gray-500">
                              <svg
                                className="w-3.5 h-3.5 sm:w-4 sm:h-4 mr-1 flex-shrink-0"
                                fill="none"
                                stroke="currentColor"
                                viewBox="0 0 24 24"
                              >
                                <path
                                  strokeLinecap="round"
                                  strokeLinejoin="round"
                                  strokeWidth={2}
                                  d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6"
                                />
                              </svg>
                              <span>{activity.travelTimeToNext} to next location</span>
                            </div>
                          )}
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      ))}

      {/* Edit Activity Modal */}
      <EditActivityModal
        isOpen={!!editingActivity}
        onClose={() => setEditingActivity(null)}
        activity={editingActivity?.activity || null}
        onSave={handleSaveActivity}
        currency={currency}
      />
    </div>
  );
}
