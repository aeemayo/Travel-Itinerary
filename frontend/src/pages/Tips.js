import React from 'react';
import { Lightbulb, Map, Coffee, Camera } from 'lucide-react';
import './Dashboard.css'; // Reusing dashboard styles for consistency

const Tips = () => {
  const tips = [
    {
      id: 1,
      icon: <Map size={24} color="#2D6A4F" />,
      title: "Plan Ahead",
      description: "Book flights and accommodations at least 3 months in advance for better deals."
    },
    {
      id: 2,
      icon: <Coffee size={24} color="#D58936" />,
      title: "Local Cuisine",
      description: "Don't be afraid to try street food. It's often the most authentic way to taste the culture."
    },
    {
      id: 3,
      icon: <Camera size={24} color="#0077B6" />,
      title: "Capture Moments",
      description: "Wake up early for photos to avoid crowds and get the best lighting."
    },
    {
      id: 4,
      icon: <Lightbulb size={24} color="#E9C46A" />,
      title: "Pack Light",
      description: "Stick to a carry-on if possible. It saves time and money at the airport."
    }
  ];

  return (
    <div className="dashboard">
      <div className="dashboard-header">
        <div className="create-banner" style={{ background: 'linear-gradient(135deg, #E9C46A 0%, #F4A261 100%)' }}>
          <div className="create-icon">
            <Lightbulb size={32} color="#FFF" />
          </div>
          <div className="create-text">
            <h2 style={{ color: '#FFF' }}>Travel Tips & Tricks</h2>
            <p style={{ color: 'rgba(255,255,255,0.9)' }}>Curated advice for your next adventure.</p>
          </div>
        </div>
      </div>

      <div className="dashboard-grid">
        <div className="recent-itineraries" style={{ gridColumn: '1 / -1' }}>
          <h3>Essential Travel Advice</h3>
          <div className="recent-grid" style={{ gridTemplateColumns: 'repeat(auto-fill, minmax(250px, 1fr))' }}>
            {tips.map(tip => (
              <div key={tip.id} className="recent-card" style={{ padding: '20px', display: 'flex', flexDirection: 'column', gap: '15px' }}>
                <div className="card-image" style={{ height: 'auto', background: 'transparent', display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: '0' }}>
                  <div style={{ padding: '15px', borderRadius: '50%', background: '#f0f4f8' }}>
                    {tip.icon}
                  </div>
                </div>
                <h4 style={{ textAlign: 'center', fontSize: '1.2rem' }}>{tip.title}</h4>
                <p style={{ textAlign: 'center', color: '#666' }}>{tip.description}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Tips;
