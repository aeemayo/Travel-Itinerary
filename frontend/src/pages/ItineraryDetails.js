import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Edit2, Sparkles, X, Loader, Check, ArrowLeft, Calendar, DollarSign, MapPin } from 'lucide-react';
import { useUser } from '../context/UserContext';
import './ItineraryDetails.css';
import API_BASE_URL from '../config';

const ItineraryDetails = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const { saveItinerary, itineraries, refreshItineraries } = useUser();

    const [showModal, setShowModal] = useState(false);
    const [showItineraryModal, setShowItineraryModal] = useState(false);
    const [loading, setLoading] = useState(false);
    const [saving, setSaving] = useState(false);
    const [saved, setSaved] = useState(false);
    const [error, setError] = useState('');
    const [itinerary, setItinerary] = useState(null);
    const [viewingSaved, setViewingSaved] = useState(false);
    const [formData, setFormData] = useState({
        destination: '',
        days: 3,
        budget: 'moderate',
        interests: [],
        additionalNotes: ''
    });

    // Load saved itinerary when ID is provided
    useEffect(() => {
        if (id && itineraries.length > 0) {
            const savedItinerary = itineraries.find(it => it.id === id);
            if (savedItinerary) {
                setItinerary(savedItinerary);
                setViewingSaved(true);
                setSaved(true);
            }
        } else if (id && itineraries.length === 0) {
            // Refresh itineraries if not loaded yet
            refreshItineraries();
        }
    }, [id, itineraries]);

    const budgetOptions = [
        { value: 'budget', label: 'Budget ($)' },
        { value: 'moderate', label: 'Moderate ($$)' },
        { value: 'luxury', label: 'Luxury ($$$)' }
    ];

    const interestOptions = [
        'Culture & History',
        'Food & Dining',
        'Adventure',
        'Nature & Wildlife',
        'Shopping',
        'Nightlife',
        'Photography',
        'Relaxation'
    ];

    const handleInterestToggle = (interest) => {
        setFormData(prev => ({
            ...prev,
            interests: prev.interests.includes(interest)
                ? prev.interests.filter(i => i !== interest)
                : [...prev.interests, interest]
        }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setError('');

        try {
            const response = await fetch(`${API_BASE_URL}/api/generate-itinerary`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(formData)
            });

            const data = await response.json();

            if (data.success) {
        const newItinerary = {
            id: String(Date.now()),
            destination: data.destination,
            days: data.days,
            budget: data.budget,
            content: data.itinerary,
            imageUrl: data.imageUrl || '',
            interests: formData.interests,
            createdAt: new Date().toISOString(),
            status: 'planned'
        };

        setItinerary(newItinerary);
        setViewingSaved(false);
        setSaved(false);
        setShowModal(false);

        // Auto-save the itinerary
        setSaving(true);
        const saveResult = await saveItinerary(newItinerary);
        setSaving(false);

        if (saveResult.success) {
            setSaved(true);
            // Update URL to include the new ID
            navigate(`/itinerary/${newItinerary.id}`, { replace: true });
        }

        // Show itinerary in a stylish modal
        setTimeout(() => setShowItineraryModal(true), 300);
    } else {
        setError(data.error || 'Failed to generate itinerary');
    }
} catch (err) {
    console.error('Error generating itinerary:', err);
    setError('Network error. Please try again.');
} finally {
    setLoading(false);
}
    };

const formatItinerary = (text) => {
    if (!text) return null;
    // Split the text into lines and format appropriately
    const lines = text.split('\n');
    return lines.map((line, index) => {
        if (line.trim() === '') return null;

        // Day headers
        if (line.includes('Day ') && line.includes(':')) {
            return <h4 key={index} className="day-title">{line}</h4>;
        }
        // Bold markers
        if (line.includes('**')) {
            return <p key={index} className="time-label">{line.replace(/\*\*/g, '')}</p>;
        }
        // List items
        if (line.trim().startsWith('-')) {
            return <li key={index} className="activity-item">{line.trim()}</li>;
        }
        // Headings with #
        if (line.trim().startsWith('#')) {
            return <h3 key={index} className="section-heading">{line.replace(/^#+\s*/, '')}</h3>;
        }
        // Regular paragraphs
        return <p key={index} className="regular-text">{line}</p>;
    });
};

const getBudgetLabel = (budget) => {
    const option = budgetOptions.find(b => b.value === budget);
    return option ? option.label : budget;
};

// Default placeholder image
const defaultImage = 'https://images.unsplash.com/photo-1488646953014-85cb44e25828?w=800&q=80';

return (
    <div className="itinerary-details">
        <div className="itinerary-header">
            {viewingSaved && (
                <button className="back-btn" onClick={() => navigate('/')}>
                    <ArrowLeft size={20} />
                    Back to Dashboard
                </button>
            )}
            <h1>{viewingSaved && itinerary ? itinerary.destination : 'Your Travel Itinerary'}</h1>
            <button className="edit-btn" onClick={() => setShowModal(true)}>
                <Edit2 size={16} />
                {itinerary ? 'Generate New' : 'Create Itinerary'}
            </button>
        </div>

        {/* Show saved itinerary content */}
        {viewingSaved && itinerary ? (
            <div className="saved-itinerary-view">
                <div className="itinerary-hero">
                    <img
                        src={itinerary.imageUrl || defaultImage}
                        alt={itinerary.destination}
                        className="hero-image"
                        onError={(e) => { e.target.src = defaultImage; }}
                    />
                    <div className="hero-overlay">
                        <h2>{itinerary.destination}</h2>
                        <div className="hero-meta">
                            <span><Calendar size={16} /> {itinerary.days} Days</span>
                            <span><DollarSign size={16} /> {getBudgetLabel(itinerary.budget)}</span>
                            {itinerary.interests && itinerary.interests.length > 0 && (
                                <span><MapPin size={16} /> {itinerary.interests.slice(0, 2).join(', ')}</span>
                            )}
                        </div>
                    </div>
                </div>

                <div className="itinerary-content-section">
                    <div className="itinerary-text-content">
                        {formatItinerary(itinerary.content)}
                    </div>
                </div>
            </div>
        ) : (
            <div className="details-grid">
                <div className="plan-section">
                    <h3>Plan Your Trip</h3>
                    <button
                        className="plan-trip-btn"
                        onClick={() => setShowModal(true)}
                    >
                        <Sparkles size={20} />
                        Create New Itinerary
                    </button>
                </div>

                <div className="timeline-section">
                    <h3>Itinerary Generator</h3>

                    {loading ? (
                        <div className="loading-state">
                            <Loader className="spinner" size={48} />
                            <p>Generating your personalized itinerary...</p>
                            <p className="loading-subtext">This may take a moment</p>
                        </div>
                    ) : (
                        <div className="empty-state">
                            <Sparkles size={64} color="#2A9D8F" style={{ marginBottom: '1rem', opacity: 0.5 }} />
                            <h4>AI-Powered Travel Planning</h4>
                            <p>Create personalized itineraries tailored to your preferences, budget, and interests</p>
                        </div>
                    )}
                </div>
            </div>
        )}

        {/* Trip Planning Modal */}
        {showModal && (
            <div className="modal-overlay" onClick={() => setShowModal(false)}>
                <div className="modal-content" onClick={(e) => e.stopPropagation()}>
                    <div className="modal-header">
                        <h2>Plan Your Trip</h2>
                        <button className="close-btn" onClick={() => setShowModal(false)}>
                            <X size={24} />
                        </button>
                    </div>

                    {error && (
                        <div style={{ padding: '1rem 1.5rem', background: '#FEE', color: '#C00', borderRadius: '8px', margin: '0 1.5rem' }}>
                            {error}
                        </div>
                    )}

                    <form onSubmit={handleSubmit}>
                        <div className="form-group">
                            <label>Destination *</label>
                            <input
                                type="text"
                                placeholder="e.g., Paris, Tokyo, New York"
                                value={formData.destination}
                                onChange={(e) => setFormData({ ...formData, destination: e.target.value })}
                                required
                            />
                        </div>

                        <div className="form-group">
                            <label>Number of Days</label>
                            <input
                                type="number"
                                min="1"
                                max="30"
                                value={formData.days}
                                onChange={(e) => setFormData({ ...formData, days: parseInt(e.target.value) })}
                                required
                            />
                        </div>

                        <div className="form-group">
                            <label>Budget Level</label>
                            <select
                                value={formData.budget}
                                onChange={(e) => setFormData({ ...formData, budget: e.target.value })}
                            >
                                {budgetOptions.map(option => (
                                    <option key={option.value} value={option.value}>
                                        {option.label}
                                    </option>
                                ))}
                            </select>
                        </div>

                        <div className="form-group">
                            <label>Interests</label>
                            <div className="interests-grid">
                                {interestOptions.map(interest => (
                                    <label key={interest} className="checkbox-label">
                                        <input
                                            type="checkbox"
                                            checked={formData.interests.includes(interest)}
                                            onChange={() => handleInterestToggle(interest)}
                                        />
                                        <span>{interest}</span>
                                    </label>
                                ))}
                            </div>
                        </div>

                        <div className="form-group">
                            <label>Additional Notes</label>
                            <textarea
                                placeholder="Any special requirements or preferences..."
                                rows="4"
                                value={formData.additionalNotes}
                                onChange={(e) => setFormData({ ...formData, additionalNotes: e.target.value })}
                            />
                        </div>

                        <button type="submit" className="generate-btn" disabled={loading}>
                            {loading ? (
                                <>
                                    <Loader className="spinner" size={20} />
                                    Generating...
                                </>
                            ) : (
                                <>
                                    <Sparkles size={20} />
                                    Generate Itinerary
                                </>
                            )}
                        </button>
                    </form>
                </div>
            </div>
        )}

        {/* Itinerary Results Modal */}
        {showItineraryModal && itinerary && (
            <div className="modal-overlay itinerary-modal-overlay" onClick={() => setShowItineraryModal(false)}>
                <div className="itinerary-modal" onClick={(e) => e.stopPropagation()}>
                    <div className="itinerary-modal-header">
                        <div className="itinerary-title-section">
                            <Sparkles size={28} color="#2A9D8F" />
                            <div>
                                <h2>{itinerary.days}-Day {itinerary.destination} Itinerary</h2>
                                <p className="itinerary-subtitle">
                                    {itinerary.budget.charAt(0).toUpperCase() + itinerary.budget.slice(1)} Budget •
                                    {saved ? ' ✓ Saved' : ' Personalized for You'}
                                </p>
                            </div>
                        </div>
                        <button className="close-btn" onClick={() => setShowItineraryModal(false)}>
                            <X size={24} />
                        </button>
                    </div>

                    <div className="itinerary-modal-content">
                        <div className="itinerary-text">
                            {formatItinerary(itinerary.content)}
                        </div>
                    </div>

                    <div className="itinerary-modal-footer">
                        <button
                            className="secondary-btn"
                            onClick={() => {
                                setShowItineraryModal(false);
                                setShowModal(true);
                            }}
                        >
                            Generate New
                        </button>
                        <button
                            className="primary-btn"
                            onClick={() => {
                                setShowItineraryModal(false);
                                setViewingSaved(true);
                            }}
                            disabled={saving}
                        >
                            {saving ? (
                                <><Loader className="spinner" size={16} /> Saving...</>
                            ) : saved ? (
                                <><Check size={16} /> View Full Itinerary</>
                            ) : (
                                'View Full Itinerary'
                            )}
                        </button>
                    </div>
                </div>
            </div>
        )}
    </div>
);
};

export default ItineraryDetails;
