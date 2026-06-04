import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router';
import { getActivityDetail, getActivityRecommendation } from '../services/api';

const ActivityDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  const [activity, setActivity] = useState(null);
  const [recommendation, setRecommendation] = useState(null);
  const [loading, setLoading] = useState(true);
  const [recommendationLoading, setRecommendationLoading] = useState(true);

  useEffect(() => {
    let intervalId;
    const fetchActivityDetails = async () => {
      try {
        const activityResponse = await getActivityDetail(id);
        setActivity(activityResponse.data);

        try {
          const recommendationResponse = await getActivityRecommendation(id);
          setRecommendation(recommendationResponse.data);
          setRecommendationLoading(false);
          if (intervalId) clearInterval(intervalId);
        } catch {
          setRecommendationLoading(true);
          intervalId = setInterval(async () => {
            try {
              const recommendationResponse = await getActivityRecommendation(id);
              setRecommendation(recommendationResponse.data);
              setRecommendationLoading(false);
              clearInterval(intervalId);
            } catch (error) {
              console.log('Recommendation not ready yet...');
            }
          }, 3000);
        }
      } catch (error) {
        console.error('Failed to fetch activity details:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchActivityDetails();
    return () => {
      if (intervalId) clearInterval(intervalId);
    };
  }, [id]);

  if (loading) {
    return (
      <div className="text-center mt-10 border border-dashed border-gray-600 p-8">
        <div className="animate-pulse mb-4">[ LOADING_DATA... ]</div>
        <div className="text-gray-500 text-sm">Fetching activity details from mainframe.</div>
      </div>
    );
  }

  if (!activity) {
    return (
      <div className="text-red-500 border border-red-500 p-4 text-center font-bold">
        ! ERROR: ACTIVITY NOT FOUND !
      </div>
    );
  }

  return (
    <div className="max-w-3xl mx-auto space-y-6">
      <button 
        onClick={() => navigate(-1)}
        className="text-gray-400 hover:text-white border-b border-transparent hover:border-white transition-colors"
      >
        &lt; BACK_TO_LIST
      </button>

      {/* Activity Details */}
      <div className="border border-gray-400 p-6 relative bg-gray-900/50">
        <div className="absolute top-0 right-0 bg-gray-400 text-black px-2 text-xs font-bold py-1">
          ID: {id.substring(0, 8)}...
        </div>
        <h2 className="text-xl font-bold uppercase mb-4 border-b border-dashed border-gray-600 pb-2">
          [ {activity.type} DETAILS ]
        </h2>
        
        <div className="grid grid-cols-2 gap-4 text-sm">
          <div>
            <span className="text-gray-500 block">DURATION</span>
            <span className="text-lg">{activity.duration} MIN</span>
          </div>
          <div>
            <span className="text-gray-500 block">CALORIES BURNED</span>
            <span className="text-lg">{activity.caloriesBurned} KCAL</span>
          </div>
          <div className="col-span-2">
            <span className="text-gray-500 block">TIMESTAMP</span>
            <span>{new Date(activity.createdAt).toLocaleString()}</span>
          </div>
        </div>
      </div>

      {/* Loading Recommendation */}
      {recommendationLoading && (
        <div className="border border-dashed border-gray-600 p-6 text-center text-gray-400">
          <div className="animate-pulse mb-2">
            &gt; GENERATING_AI_RECOMMENDATION...
          </div>
          <div className="text-xs">Processing via neural net. Please stand by.</div>
        </div>
      )}

      {/* Recommendation */}
      {recommendation && (
        <div className="border border-gray-400 p-6 relative mt-6">
          <div className="absolute -top-3 left-4 bg-black px-2 text-sm font-bold text-green-400">
            [ AI_ANALYSIS_COMPLETE ]
          </div>

          <div className="space-y-6 mt-2">
            <div>
              <h3 className="text-gray-500 uppercase text-xs mb-2">Analysis</h3>
              <p className="text-sm leading-relaxed">&gt; {recommendation.recommendation}</p>
            </div>

            {recommendation.improvements && recommendation.improvements.length > 0 && (
              <div className="border-t border-dashed border-gray-700 pt-4">
                <h3 className="text-gray-500 uppercase text-xs mb-2">Improvements</h3>
                <ul className="space-y-1 text-sm">
                  {recommendation.improvements.map((item, i) => (
                    <li key={i} className="flex gap-2">
                      <span className="text-green-500">*</span> <span>{item}</span>
                    </li>
                  ))}
                </ul>
              </div>
            )}

            {recommendation.suggestions && recommendation.suggestions.length > 0 && (
              <div className="border-t border-dashed border-gray-700 pt-4">
                <h3 className="text-gray-500 uppercase text-xs mb-2">Suggestions</h3>
                <ul className="space-y-1 text-sm">
                  {recommendation.suggestions.map((item, i) => (
                    <li key={i} className="flex gap-2">
                      <span className="text-blue-500">+</span> <span>{item}</span>
                    </li>
                  ))}
                </ul>
              </div>
            )}

            {recommendation.safety && recommendation.safety.length > 0 && (
              <div className="border-t border-dashed border-gray-700 pt-4">
                <h3 className="text-gray-500 uppercase text-xs mb-2">Safety Guidelines</h3>
                <ul className="space-y-1 text-sm text-yellow-500">
                  {recommendation.safety.map((item, i) => (
                    <li key={i} className="flex gap-2">
                      <span>!</span> <span>{item}</span>
                    </li>
                  ))}
                </ul>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default ActivityDetail;