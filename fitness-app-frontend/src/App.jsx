import { useContext, useEffect, useState } from "react";
import { AuthContext } from "react-oauth2-code-pkce";
import { useDispatch } from "react-redux";
import { BrowserRouter as Router, Navigate, Route, Routes } from "react-router";
import { setCredentials } from "./store/authSlice";
import ActivityForm from "./components/ActivityForm";
import ActivityList from "./components/ActivityList";
import ActivityDetail from "./components/ActivityDetail";

const ActivitiesPage = () => {
  const [refreshKey, setRefreshKey] = useState(0);

  return (
    <div className="p-4 border-2 border-dashed border-gray-600 space-y-6">
      <ActivityForm onActivityAdded={() => setRefreshKey(prev => prev + 1)} />
      <ActivityList refreshKey={refreshKey} />
    </div>
  );
};

function App() {
  const { token, tokenData, logIn, logOut } = useContext(AuthContext);
  const dispatch = useDispatch();
  
  useEffect(() => {
    if (token) {
      dispatch(setCredentials({token, user: tokenData}));
    }
  }, [token, tokenData, dispatch]);

  return (
    <Router>
      <div className="min-h-screen bg-black text-gray-200 font-mono p-4 md:p-8">
        <div className="max-w-4xl mx-auto">
          {!token ? (
            <div className="flex flex-col items-center justify-center min-h-[80vh] text-center border-2 border-dashed border-gray-600 p-8">
              <h1 className="text-2xl md:text-4xl mb-4 font-bold tracking-widest uppercase">
                [ FITNESS TRACKER ]
              </h1>
              <p className="mb-8 text-gray-400">
                &gt; Please login to access your activities_
              </p>
              <button 
                className="px-6 py-2 border-2 border-gray-400 hover:bg-gray-800 hover:text-white transition-colors uppercase font-bold"
                onClick={() => logIn()}
              >
                [ LOGIN ]
              </button>
            </div>
          ) : (
            <div className="space-y-4">
              <div className="flex justify-between items-center border-b-2 border-dashed border-gray-600 pb-4">
                <h1 className="text-xl font-bold">[ FITNESS TRACKER ]</h1>
                <button 
                  className="px-4 py-1 border border-gray-400 hover:bg-gray-800 transition-colors text-sm"
                  onClick={logOut}
                >
                  [ LOGOUT ]
                </button>
              </div>
              <Routes>
                <Route path="/activities" element={<ActivitiesPage />}/>
                <Route path="/activities/:id" element={<ActivityDetail />}/>
                <Route path="/" element={token ? <Navigate to="/activities" replace/> : <div>&gt; Welcome! Please Login.</div>} />
              </Routes>
            </div>
          )}
        </div>
      </div>
    </Router>
  );
}

export default App;