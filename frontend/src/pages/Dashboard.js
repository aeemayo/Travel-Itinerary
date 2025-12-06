import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Plus, Calendar, MapPin, Sparkles } from 'lucide-react';
import { useUser } from '../context/UserContext';
import './Dashboard.css';

const Dashboard = () => {
  const navigate = useNavigate();
  const { itineraries, refreshItineraries } = useUser();

  useEffect(() => {
    refreshItineraries();
  }, []);

  // Get the most recent itinerary as "upcoming trip"
  const upcomingTrip = itineraries.length > 0 ? itineraries[0] : null;
  
  // Get up to 3 recent itineraries (excluding the first one if it exists)
  const recentItineraries = itineraries.length > 1 ? itineraries.slice(1, 4) : [];

  // Format date for display
  const formatDate = (dateStr) => {
    if (!dateStr) return '';
    const date = new Date(dateStr);
    return date.toLocaleDateString('en-US', { month: 'short', year: 'numeric' });
  };

  // Calculate days since creation (for progress display)
  const getDaysInfo = (dateStr, days) => {
    if (!dateStr) return { progress: 50, daysText: 'Planning...' };
    const created = new Date(dateStr);
    const now = new Date();
    const daysPassed = Math.floor((now - created) / (1000 * 60 * 60 * 24));
    const progress = Math.min(100, (daysPassed / (days || 7)) * 100);
    return {
      progress: Math.max(10, progress),
      daysText: daysPassed === 0 ? 'Just created' : `Created ${daysPassed} days ago`
    };
  };

  // Default placeholder image
  const defaultImage = 'https://images.unsplash.com/photo-1488646953014-85cb44e25828?w=800&q=80';

  return (
    <div className="dashboard">
      <div className="dashboard-header">
        <div className="create-banner">
          <div className="create-icon">
            <Plus size={32} color="#2D6A4F" />
          </div>
          <div className="create-text">
            <h2>Create New Itinerary</h2>
            <p>Let AI build your perfect trip.</p>
          </div>
        </div>

        <button className="explore-btn" onClick={() => navigate('/explore')}>Explore</button>
      </div>

      <div className="dashboard-grid">
        <div className="upcoming-trip">
          <h3>Your Upcoming Trip</h3>
          {upcomingTrip ? (
            <div className="trip-card large">
              <img 
                src={upcomingTrip.imageUrl || defaultImage} 
                alt={upcomingTrip.destination} 
                className="trip-bg"
                onError={(e) => { e.target.src = defaultImage; }}
              />
              <div className="trip-overlay">
                <div className="trip-info">
                  <h2>{upcomingTrip.destination}</h2>
                  <div className="trip-meta">
                    <span>
                      <Calendar size={14} style={{ marginRight: '4px', verticalAlign: 'middle' }} />
                      {upcomingTrip.days} days • {upcomingTrip.budget}
                    </span>
                  </div>
                  <div className="progress-bar">
                    <div 
                      className="progress" 
                      style={{ width: `${getDaysInfo(upcomingTrip.createdAt, upcomingTrip.days).progress}%` }}
                    ></div>
                  </div>
                  <div className="days-left">
                    {getDaysInfo(upcomingTrip.createdAt, upcomingTrip.days).daysText}
                  </div>
                  <button className="view-btn" onClick={() => navigate(`/itinerary/${upcomingTrip.id}`)}>View Itinerary</button>
                </div>
              </div>
            </div>
          ) : (
            <div className="empty-upcoming-trip">
              <div className="empty-state-card">
                <Sparkles size={48} color="#2A9D8F" style={{ opacity: 0.6 }} />
                <h4>No trips planned yet</h4>
                <p>Generate your first AI-powered itinerary!</p>
                <button className="create-trip-btn" onClick={() => navigate('/itinerary')}>
                  <Plus size={18} />
                  Create Trip
                </button>
              </div>
            </div>
          )}
        </div>

        <div className="recent-itineraries">
          <h3>Recent Itineraries</h3>
          {recentItineraries.length > 0 ? (
            <div className="recent-grid">
              {recentItineraries.map((trip, index) => (
                <div key={trip.id || index} className="recent-card" onClick={() => navigate(`/itinerary/${trip.id}`)}>
                  <div className="card-image">
                    <img 
                      src={trip.imageUrl || defaultImage} 
                      alt={trip.destination}
                      onError={(e) => { e.target.src = defaultImage; }}
                    />
                    <span className={`status-tag ${trip.status === 'draft' ? 'draft' : 'planned'}`}>
                      {trip.status === 'draft' ? 'Draft' : 'Planned'}
                    </span>
                  </div>
                  <h4>{trip.destination}</h4>
                  <p>({formatDate(trip.createdAt)})</p>
                </div>
              ))}
            </div>
          ) : (
            <div className="empty-recent">
              <div className="empty-state-small">
                <MapPin size={32} color="#666" style={{ opacity: 0.5 }} />
                <p>Your generated itineraries will appear here</p>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
