import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Plus } from 'lucide-react';
import './Dashboard.css';

const Dashboard = () => {
  const navigate = useNavigate();

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
          <div className="trip-card large">
            <img src="https://images.unsplash.com/photo-1493976040374-85c8e12f0c0e?ixlib=rb-4.0.3&auto=format&fit=crop&w=2070&q=80" alt="Kyoto" className="trip-bg" />
            <div className="trip-overlay">
              <div className="trip-info">
                <h2>Kyoto & Osaka Adventure</h2>
                <div className="trip-meta">
                  <span>Oct 15 - Oct 25, 2023</span>
                </div>
                <div className="progress-bar">
                  <div className="progress" style={{ width: '60%' }}></div>
                </div>
                <div className="days-left">45 days to go</div>
                <button className="view-btn" onClick={() => navigate('/itinerary')}>View Itinerary</button>
              </div>
            </div>
          </div>
        </div>

        <div className="recent-itineraries">
          <h3>Recent Itineraries</h3>
          <div className="recent-grid">
            <div className="recent-card">
              <div className="card-image">
                <img src="https://images.unsplash.com/photo-1516483638261-f4dbaf036963?ixlib=rb-4.0.3&auto=format&fit=crop&w=686&q=80" alt="Italy" />
                <span className="status-tag draft">Draft</span>
              </div>
              <h4>Summer in Italy</h4>
              <p>(Jul 2024)</p>
            </div>

            <div className="recent-card">
              <div className="card-image">
                <img src="https://images.unsplash.com/photo-1496442226666-8d4a0e62e6e9?ixlib=rb-4.0.3&auto=format&fit=crop&w=1170&q=80" alt="NYC" />
                <span className="status-tag planned">Planned</span>
              </div>
              <h4>Weekend in NYC</h4>
              <p>(Dec 2023)</p>
            </div>

            <div className="recent-card">
              <div className="card-image">
                <img src="https://images.unsplash.com/photo-1502602898657-3e91760cbb34?ixlib=rb-4.0.3&auto=format&fit=crop&w=1173&q=80" alt="Paris" />
                <span className="status-tag planned">Planned</span>
              </div>
              <h4>Paris Getaway</h4>
              <p>(Mar 2024)</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
