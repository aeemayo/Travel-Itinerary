import React from 'react';
import { Search, MapPin, Compass } from 'lucide-react';
import './Dashboard.css';

const Explore = () => {
    const destinations = [
        {
            id: 1,
            name: "Tokyo, Japan",
            image: "https://images.unsplash.com/photo-1540959733332-eab4deabeeaf?ixlib=rb-4.0.3&auto=format&fit=crop&w=1170&q=80",
            category: "City",
            guideUrl: "https://www.getyourguide.com/s/?q=Tokyo%20Japan",
            description: "Modern metropolis meets ancient tradition"
        },
        {
            id: 2,
            name: "Dubai, UAE",
            image: "https://images.unsplash.com/photo-1512453979798-5ea266f8880c?ixlib=rb-4.0.3&auto=format&fit=crop&w=1170&q=80",
            category: "City",
            guideUrl: "https://www.getyourguide.com/s/?q=Dubai%20UAE",
            description: "Luxury, innovation, and desert adventures"
        },
        {
            id: 3,
            name: "Paris, France",
            image: "https://images.unsplash.com/photo-1502602898657-3e91760cbb34?ixlib=rb-4.0.3&auto=format&fit=crop&w=1173&q=80",
            category: "Culture",
            guideUrl: "https://www.getyourguide.com/s/?q=Paris%20France",
            description: "The city of lights and romance"
        },
        {
            id: 4,
            name: "Santorini, Greece",
            image: "https://images.unsplash.com/photo-1570077188670-e3a8d69ac5ff?ixlib=rb-4.0.3&auto=format&fit=crop&w=1129&q=80",
            category: "Beach",
            guideUrl: "https://www.getyourguide.com/s/?q=Santorini%20Greece",
            description: "White-washed villages and stunning sunsets"
        },
        {
            id: 5,
            name: "Bali, Indonesia",
            image: "https://images.unsplash.com/photo-1537996194471-e657df975ab4?ixlib=rb-4.0.3&auto=format&fit=crop&w=1038&q=80",
            category: "Nature",
            guideUrl: "https://www.getyourguide.com/s/?q=Bali%20Indonesia",
            description: "Tropical paradise with rich culture"
        },
        {
            id: 6,
            name: "Iceland",
            image: "https://images.unsplash.com/photo-1504829857797-ddff29c27927?ixlib=rb-4.0.3&auto=format&fit=crop&w=1170&q=80",
            category: "Nature",
            guideUrl: "https://www.getyourguide.com/s/?q=Iceland",
            description: "Northern lights and geothermal wonders"
        },
        {
            id: 7,
            name: "Machu Picchu, Peru",
            image: "https://images.unsplash.com/photo-1526392060635-9d6019884377?ixlib=rb-4.0.3&auto=format&fit=crop&w=1170&q=80",
            category: "History",
            guideUrl: "https://www.getyourguide.com/s/?q=Machu%20Picchu%20Peru",
            description: "Ancient Incan citadel in the clouds"
        },
        {
            id: 8,
            name: "Swiss Alps",
            image: "https://images.unsplash.com/photo-1531366936337-7c912a4589a7?ixlib=rb-4.0.3&auto=format&fit=crop&w=1170&q=80",
            category: "Mountain",
            guideUrl: "https://www.getyourguide.com/s/?q=Swiss%20Alps",
            description: "Majestic peaks and alpine villages"
        },
        {
            id: 9,
            name: "Kyoto, Japan",
            image: "https://images.unsplash.com/photo-1493976040374-85c8e12f0c0e?ixlib=rb-4.0.3&auto=format&fit=crop&w=1170&q=80",
            category: "Culture",
            guideUrl: "https://www.getyourguide.com/s/?q=Kyoto%20Japan",
            description: "Traditional temples and zen gardens"
        },
        {
            id: 10,
            name: "Costa Rica",
            image: "https://images.unsplash.com/photo-1568632234157-ce7aecd03d0d?ixlib=rb-4.0.3&auto=format&fit=crop&w=1170&q=80",
            category: "Nature",
            guideUrl: "https://www.getyourguide.com/s/?q=Costa%20Rica",
            description: "Rainforests, beaches, and wildlife"
        },
        {
            id: 11,
            name: "New Zealand",
            image: "https://images.unsplash.com/photo-1507699622108-4be3abd695ad?ixlib=rb-4.0.3&auto=format&fit=crop&w=1171&q=80",
            category: "Nature",
            guideUrl: "https://www.getyourguide.com/s/?q=New%20Zealand",
            description: "Stunning landscapes and adventure sports"
        },
        {
            id: 12,
            name: "Seoul, South Korea",
            image: "https://images.unsplash.com/photo-1536098561742-ca998e48cbcc?ixlib=rb-4.0.3&auto=format&fit=crop&w=1172&q=80",
            category: "City",
            guideUrl: "https://www.getyourguide.com/s/?q=Seoul%20South%20Korea",
            description: "Modern city with K-culture vibes"
        },
        {
            id: 13,
            name: "Lisbon, Portugal",
            image: "https://images.unsplash.com/photo-1555881400-74d7acaacd8b?ixlib=rb-4.0.3&auto=format&fit=crop&w=1170&q=80",
            category: "City",
            guideUrl: "https://www.getyourguide.com/s/?q=Lisbon%20Portugal",
            description: "Historic charm and coastal beauty"
        },
        {
            id: 14,
            name: "Cairo, Egypt",
            image: "https://images.unsplash.com/photo-1572252009286-268acec5ca0a?ixlib=rb-4.0.3&auto=format&fit=crop&w=1170&q=80",
            category: "History",
            guideUrl: "https://www.getyourguide.com/s/?q=Cairo%20Egypt",
            description: "Ancient pyramids and timeless wonders"
        },
        {
            id: 15,
            name: "Banff, Canada",
            image: "https://images.unsplash.com/photo-1520208422220-d12a3c588e6c?ixlib=rb-4.0.3&auto=format&fit=crop&w=1170&q=80",
            category: "Mountain",
            guideUrl: "https://www.getyourguide.com/s/?q=Banff%20Canada",
            description: "Turquoise lakes and mountain wilderness"
        },
        {
            id: 16,
            name: "Halong Bay, Vietnam",
            image: "https://images.unsplash.com/photo-1528127269322-539801943592?ixlib=rb-4.0.3&auto=format&fit=crop&w=1170&q=80",
            category: "Nature",
            guideUrl: "https://www.getyourguide.com/s/?q=Halong%20Bay%20Vietnam",
            description: "Emerald waters and limestone islands"
        },
        {
            id: 17,
            name: "Havana, Cuba",
            image: "https://images.unsplash.com/photo-1519821172144-4f87d85de2a1?ixlib=rb-4.0.3&auto=format&fit=crop&w=1170&q=80",
            category: "Culture",
            guideUrl: "https://www.getyourguide.com/s/?q=Havana%20Cuba",
            description: "Colorful streets and vibrant culture"
        },
        {
            id: 18,
            name: "Sri Lanka",
            image: "https://images.unsplash.com/photo-1566073771259-6a8506099945?ixlib=rb-4.0.3&auto=format&fit=crop&w=1170&q=80",
            category: "Beach",
            guideUrl: "https://www.getyourguide.com/s/?q=Sri%20Lanka",
            description: "Beaches, tea plantations, and wildlife"
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
                                <p style={{ 
                                    margin: '5px 0', 
                                    fontSize: '0.85rem', 
                                    color: '#666',
                                    minHeight: '40px'
                                }}>
                                    {dest.description}
                                </p>
                                <a 
                                    href={dest.guideUrl} 
                                    target="_blank" 
                                    rel="noopener noreferrer"
                                    style={{ 
                                        marginTop: '10px', 
                                        display: 'inline-flex', 
                                        alignItems: 'center', 
                                        gap: '5px',
                                        color: '#2A9D8F',
                                        textDecoration: 'none',
                                        fontWeight: '500',
                                        fontSize: '0.9rem',
                                        transition: 'color 0.2s'
                                    }}
                                    onMouseEnter={(e) => e.target.style.color = '#1D7568'}
                                    onMouseLeave={(e) => e.target.style.color = '#2A9D8F'}
                                >
                                    <MapPin size={14} /> View Guide →
                                </a>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Explore;
