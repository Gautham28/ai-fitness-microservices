import React, { useState } from 'react';
import { addActivity } from '../services/api';

const ActivityForm = ({ onActivityAdded }) => {
  const [activity, setActivity] = useState({
    type: "RUNNING", duration: '', caloriesBurned: '',
    additionalMetrics: {}
  });
  const [error, setError] = useState(null);
  const [submitting, setSubmitting] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);
    setSubmitting(true);
    try {
      const payload = {
        type: activity.type,
        duration: Number(activity.duration),
        caloriesBurned: Number(activity.caloriesBurned),
        additionalMetrics: activity.additionalMetrics || {},
      };
      await addActivity(payload);
      if (onActivityAdded) {
        onActivityAdded();
      }
      setActivity({ type: "RUNNING", duration: '', caloriesBurned: '', additionalMetrics: {} });
    } catch (err) {
      const message =
        err.response?.data?.message ||
        err.response?.statusText ||
        err.message ||
        'Failed to log activity';
      setError(message);
      console.error(err);
    } finally {
      setSubmitting(false);
    }
  };
    
  return (
    <form onSubmit={handleSubmit} className="border border-gray-500 p-4 mb-6 relative mt-4">
      <div className="absolute -top-3 left-4 bg-black px-2 text-sm font-bold text-gray-300">
        [ ADD ACTIVITY ]
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-2">
        <div className="flex flex-col space-y-1">
          <label className="text-xs text-gray-400 uppercase">Activity Type</label>
          <select
            className="bg-black border border-gray-600 p-2 text-sm focus:outline-none focus:border-white transition-colors"
            value={activity.type}
            onChange={(e) => setActivity({...activity, type: e.target.value})}
          >
            <option value="RUNNING">RUNNING</option>
            <option value="WALKING">WALKING</option>
            <option value="CYCLING">CYCLING</option>
          </select>
        </div>

        <div className="flex flex-col space-y-1">
          <label className="text-xs text-gray-400 uppercase">Duration (Min)</label>
          <input
            className="bg-black border border-gray-600 p-2 text-sm focus:outline-none focus:border-white transition-colors"
            type="number"
            value={activity.duration}
            onChange={(e) => setActivity({...activity, duration: e.target.value})}
            placeholder="0"
            required
          />
        </div>

        <div className="flex flex-col space-y-1">
          <label className="text-xs text-gray-400 uppercase">Calories Burned</label>
          <input
            className="bg-black border border-gray-600 p-2 text-sm focus:outline-none focus:border-white transition-colors"
            type="number"
            value={activity.caloriesBurned}
            onChange={(e) => setActivity({...activity, caloriesBurned: e.target.value})}
            placeholder="0"
            required
          />
        </div>
      </div>

      {error && (
        <p className="mt-3 text-sm text-red-400 border border-red-500 p-2">
          ! ERROR: {error}
        </p>
      )}

      <div className="mt-4 flex justify-end">
        <button 
          type="submit"
          disabled={submitting}
          className="px-4 py-2 border border-gray-400 hover:bg-white hover:text-black font-bold text-sm uppercase transition-colors disabled:opacity-50"
        >
          {submitting ? '&gt; SUBMITTING...' : '&gt; SUBMIT LOG'}
        </button>
      </div>
    </form>
  );
};

export default ActivityForm;