import { useState, useEffect } from 'react';
import { Activity, subscribeToPatientActivities } from '../services/healthRecordService';
import { ClockIcon } from '@heroicons/react/24/outline';

interface RecentActivityProps {
  patientId: string;
}

export function RecentActivity({ patientId }: RecentActivityProps) {
  const [activities, setActivities] = useState<Activity[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    console.log('🔔 RecentActivity: Subscribing to activities for patient:', patientId);
    const unsubscribe = subscribeToPatientActivities(patientId, (newActivities) => {
      console.log('🔔 RecentActivity: Received', newActivities.length, 'activities from Firestore');
      console.log('🔔 Activities:', newActivities);
      setActivities(newActivities);
      setLoading(false);
    });

    return () => {
      console.log('🔔 RecentActivity: Unsubscribing from activities');
      unsubscribe();
    };
  }, [patientId]);

  const getTimeAgo = (date: Date): string => {
    const seconds = Math.floor((new Date().getTime() - date.getTime()) / 1000);
    
    if (seconds < 60) return 'Just now';
    if (seconds < 3600) return `${Math.floor(seconds / 60)} minutes ago`;
    if (seconds < 86400) return `${Math.floor(seconds / 3600)} hours ago`;
    if (seconds < 604800) return `${Math.floor(seconds / 86400)} days ago`;
    return date.toLocaleDateString();
  };

  const getActivityColor = (type: Activity['type']): string => {
    switch (type) {
      case 'prescription_created':
        return 'border-blue-500';
      case 'prescription_filled':
      case 'prescription_refilled':
        return 'border-green-500';
      case 'lab_test_ordered':
        return 'border-orange-500';
      case 'lab_test_completed':
        return 'border-purple-500';
      case 'appointment_scheduled':
      case 'appointment_confirmed':
        return 'border-indigo-500';
      default:
        return 'border-gray-500';
    }
  };

  if (loading) {
    return (
      <div className="bg-white shadow overflow-hidden sm:rounded-lg">
        <div className="px-4 py-5 sm:px-6 border-b border-gray-200">
          <h3 className="text-lg leading-6 font-medium text-gray-900">Recent Activity</h3>
          <p className="mt-1 text-sm text-gray-500">Your recent health activities and updates.</p>
        </div>
        <div className="px-4 py-8 flex justify-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white shadow overflow-hidden sm:rounded-lg">
      <div className="px-4 py-5 sm:px-6 border-b border-gray-200">
        <h3 className="text-lg leading-6 font-medium text-gray-900">Recent Activity</h3>
        <p className="mt-1 text-sm text-gray-500">Your recent health activities and updates.</p>
      </div>
      <div className="px-4 py-5 sm:p-6">
        {activities.length === 0 ? (
          <div className="text-center py-8">
            <ClockIcon className="mx-auto h-12 w-12 text-gray-400" />
            <p className="mt-2 text-sm text-gray-500">No recent activity</p>
          </div>
        ) : (
          <div className="space-y-4">
            {activities.map((activity) => (
              <div
                key={activity.id}
                className={`border-l-4 ${getActivityColor(activity.type)} pl-4 py-2 hover:bg-gray-50 transition-colors rounded-r`}
              >
                <p className="text-sm font-medium text-gray-900">{activity.title}</p>
                <p className="text-sm text-gray-500">{activity.description}</p>
                <div className="flex items-center justify-between mt-1">
                  <p className="text-xs text-gray-400">{getTimeAgo(activity.createdAt)}</p>
                  <span className="text-xs text-gray-500 capitalize">
                    by {activity.actorName}
                  </span>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
