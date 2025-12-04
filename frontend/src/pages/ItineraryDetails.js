import React from 'react';
import { Plane, Hotel, Map, Wallet, Edit2 } from 'lucide-react';
import './ItineraryDetails.css';

const ItineraryDetails = () => {
    return (
        <div className="itinerary-details">
            <div className="itinerary-header">
                <h1>Detailed Itinerary View</h1>
                <button className="edit-btn">
                    <Edit2 size={16} />
                    Edit Itinerary
                </button>
            </div>

            <div className="hero-section">
                <img src="https://images.unsplash.com/photo-1493976040374-85c8e12f0c0e?ixlib=rb-4.0.3&auto=format&fit=crop&w=2070&q=80" alt="Kyoto" className="hero-bg" />
                <div className="hero-overlay">
                    <div className="hero-content">
                        <h2>Kyoto & Osaka Adventure</h2>
                        <p className="hero-date">Oct 15 - Oct 25, 2023</p>
                        <div className="hero-progress-container">
                            <div className="hero-progress-bar">
                                <div className="hero-progress" style={{ width: '60%' }}></div>
                            </div>
                            <span className="hero-days-left">45 days to go</span>
                        </div>
                    </div>
                </div>
            </div>

            <div className="details-grid">
                <div className="plan-section">
                    <h3>Plan Your Trip</h3>
                    <div className="actions-grid">
                        <div className="action-card">
                            <div className="action-icon flight">
                                <Plane size={24} />
                            </div>
                            <div className="action-text">
                                <h4>Add Flights</h4>
                                <button className="action-btn">Add Flights</button>
                            </div>
                        </div>

                        <div className="action-card">
                            <div className="action-icon hotel">
                                <Hotel size={24} />
                            </div>
                            <div className="action-text">
                                <h4>Book Hotels</h4>
                                <button className="action-btn">Book Hotels</button>
                            </div>
                        </div>

                        <div className="action-card">
                            <div className="action-icon activity">
                                <Map size={24} />
                            </div>
                            <div className="action-text">
                                <h4>Explore Activities</h4>
                                <button className="action-btn">Explore Activities</button>
                            </div>
                        </div>

                        <div className="action-card">
                            <div className="action-icon budget">
                                <Wallet size={24} />
                            </div>
                            <div className="action-text">
                                <h4>Manage Budget</h4>
                                <button className="action-btn">Manage Budget</button>
                            </div>
                        </div>
                    </div>
                </div>

                <div className="timeline-section">
                    <h3>Your Itinerary</h3>
                    <div className="timeline">
                        <div className="timeline-item">
                            <div className="timeline-dot"></div>
                            <div className="timeline-content">
                                <h4>Day 1: Arrival in Osaka</h4>
                                <div className="timeline-card">
                                    <img src="https://images.unsplash.com/photo-1590559399607-99d51e854632?ixlib=rb-4.0.3&auto=format&fit=crop&w=1170&q=80" alt="Osaka" />
                                    <div className="timeline-details">
                                        <p><strong>Arrivara in Osaka</strong></p>
                                        <p>23:00 - 05 hours</p>
                                        <p>03:00 - 25 min</p>
                                    </div>
                                </div>
                            </div>
                        </div>

                        <div className="timeline-item">
                            <div className="timeline-dot"></div>
                            <div className="timeline-content">
                                <h4>Day 2: Osaka Castle & Food Tour</h4>
                                <div className="timeline-card">
                                    <img src="https://images.unsplash.com/photo-1590253230530-1b70bbc97733?ixlib=rb-4.0.3&auto=format&fit=crop&w=1170&q=80" alt="Osaka Castle" />
                                    <div className="timeline-details">
                                        <p><strong>07:00 - Osaka</strong></p>
                                        <p>14:00 - 15 hours</p>
                                        <p>09:00 - 25 min</p>
                                    </div>
                                </div>
                            </div>
                        </div>

                        <div className="timeline-item">
                            <div className="timeline-dot"></div>
                            <div className="timeline-content">
                                <h4>Day 3: Train to Kyoto</h4>
                                <div className="timeline-card">
                                    <img src="https://images.unsplash.com/photo-1493976040374-85c8e12f0c0e?ixlib=rb-4.0.3&auto=format&fit=crop&w=2070&q=80" alt="Kyoto" />
                                    <div className="timeline-details">
                                        <p><strong>09:00 - Osaka</strong></p>
                                        <p>13:00 - 25 hours</p>
                                        <p>09:30 - 17 min</p>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default ItineraryDetails;
