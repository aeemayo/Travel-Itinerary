import React from 'react';
import { Search, MapPin, Compass } from 'lucide-react';
import './Dashboard.css';

const Explore = () => {
    const destinations = [
        {
            id: 1,
            name: "Santorini, Greece",
            image: "https://images.unsplash.com/photo-1570077188670-e3a8d69ac5ff?ixlib=rb-4.0.3&auto=format&fit=crop&w=1129&q=80",
            category: "Beach"
        },
        {
            id: 2,
            name: "Bali, Indonesia",
            image: "https://images.unsplash.com/photo-1537996194471-e657df975ab4?ixlib=rb-4.0.3&auto=format&fit=crop&w=1038&q=80",
            category: "Nature"
        },
        {
            id: 3,
            name: "Swiss Alps",
            image: "https://images.unsplash.com/photo-1531366936337-7c912a4589a7?ixlib=rb-4.0.3&auto=format&fit=crop&w=1170&q=80",
            category: "Mountain"
        },
        {
            id: 4,
            name: "Machu Picchu, Peru",
            image: "https://images.unsplash.com/photo-1526392060635-9d6019884377?ixlib=rb-4.0.3&auto=format&fit=crop&w=1170&q=80",
            category: "History"
        }
    ];

    return (
        <div className="dashboard">
            <div className="dashboard-header">
                <div className="create-banner" style={{ background: 'linear-gradient(135deg, #2A9D8F 0%, #264653 100%)' }}>
                    <div className="create-icon">
                        <Compass size={32} color="#FFF" />
                    </div>
                    <div className="create-text">
                        <h2 style={{ color: '#FFF' }}>Explore Destinations</h2>
                        <p style={{ color: 'rgba(255,255,255,0.9)' }}>Discover your next dream getaway.</p>
                    </div>
                </div>

                <div className="search-bar">
                    <Search className="search-icon" size={20} />
                    <input type="text" placeholder="Search destinations, activities..." />
                    <button className="explore-btn">Search</button>
                </div>
            </div>

            <div className="dashboard-grid">
                <div className="recent-itineraries" style={{ gridColumn: '1 / -1' }}>
                    <h3>Popular Destinations</h3>
                    <div className="recent-grid">
                        {destinations.map(dest => (
                            <div key={dest.id} className="recent-card">
                                <div className="card-image">
                                    <img src={dest.image} alt={dest.name} />
                                    <span className="status-tag planned">{dest.category}</span>
                                </div>
                                <h4>{dest.name}</h4>
                                <p style={{ marginTop: '5px', display: 'flex', alignItems: 'center', gap: '5px' }}>
                                    <MapPin size={14} /> View Guide
                                </p>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Explore;
