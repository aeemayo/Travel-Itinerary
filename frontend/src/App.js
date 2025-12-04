import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Layout from './components/Layout';
import Dashboard from './pages/Dashboard';
import ItineraryDetails from './pages/ItineraryDetails';
import Tips from './pages/Tips';
import Explore from './pages/Explore';
import Profile from './pages/Profile';
import Login from './pages/Login';
import { UserProvider, useUser } from './context/UserContext';

// Protected Route Component
const ProtectedRoute = ({ children }) => {
  const { user, loading } = useUser();
  
  if (loading) return <div>Loading...</div>;
  
  if (!user) {
    return <Login />;
  }
  
  return children;
};

function App() {
  return (
    <UserProvider>
      <Router>
        <Routes>
          <Route path="/login" element={<Login />} />
          <Route path="*" element={
            <ProtectedRoute>
              <Layout>
                <Routes>
                  <Route path="/" element={<Dashboard />} />
                  <Route path="/itinerary" element={<ItineraryDetails />} />
                  <Route path="/tips" element={<Tips />} />
                  <Route path="/trips" element={<div>Trips Page (Coming Soon)</div>} />
                  <Route path="/explore" element={<Explore />} />
                  <Route path="/profile" element={<Profile />} />
                </Routes>
              </Layout>
            </ProtectedRoute>
          } />
        </Routes>
      </Router>
    </UserProvider>
  );
}

export default App;
