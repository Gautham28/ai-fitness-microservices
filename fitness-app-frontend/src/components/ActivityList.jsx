import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router';
import { getActivities } from '../services/api';

const ActivityList = ({ refreshKey }) => {
  const [activities, setActivities] = useState([]);
  const navigate = useNavigate();

  const fetchActivities = async () => {
    try {
      const response = await getActivities();
      setActivities(response.data);
    } catch (error) {
      console.error(error);
    }
  };

  useEffect(() => {
    fetchActivities();
  }, [refreshKey]);

  return (
    <div className="space-y-4">
      <h2 className="text-lg font-bold border-b border-dashed border-gray-600 inline-block mb-2">
        === ACTIVITY LOG ===
      </h2>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {activities.map((activity) => (
          <div
            key={activity.id}
            className="border border-gray-500 p-4 cursor-pointer hover:bg-gray-900 transition-colors group relative"
            onClick={() => navigate(`/activities/${activity.id}`)}
          >
            <div className="absolute top-0 right-0 p-1 text-xs text-gray-600 group-hover:text-gray-400">
              [+]
            </div>
            <div className="font-bold mb-2 uppercase border-b border-dotted border-gray-700 pb-1">
              &gt; {activity.type}
            </div>
            <div className="text-sm text-gray-400 space-y-1 mt-2">
              <p>DURATION: {activity.duration} MIN</p>
              <p>CALORIES: {activity.caloriesBurned} KCAL</p>
            </div>
          </div>
        ))}
        {activities.length === 0 && (
          <div className="col-span-full text-gray-500 italic">
            No activities found. Log one above.
          </div>
        )}
      </div>
    </div>
  );
};

export default ActivityList;