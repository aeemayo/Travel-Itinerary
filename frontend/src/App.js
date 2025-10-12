import React, { useState } from 'react';
import axios from 'axios';
import './App.css';

function App() {
  const [formData, setFormData] = useState({
    destination: '',
    days: 3,
    budget: 'moderate',
    interests: [],
    additionalNotes: ''
  });

  const [itinerary, setItinerary] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [question, setQuestion] = useState('');
  const [answer, setAnswer] = useState(null);
  const [askingQuestion, setAskingQuestion] = useState(false);

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

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

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
    setError(null);
    setItinerary(null);
    setAnswer(null);

    try {
      const response = await axios.post('http://localhost:5000/api/generate-itinerary', formData);
      setItinerary(response.data);
    } catch (err) {
      setError(err.response?.data?.details || err.message || 'Failed to generate itinerary');
    } finally {
      setLoading(false);
    }
  };

  const handleAskQuestion = async (e) => {
    e.preventDefault();
    if (!question.trim()) return;

    setAskingQuestion(true);
    setAnswer(null);

    try {
      const response = await axios.post('http://localhost:5000/api/ask-question', {
        question,
        destination: formData.destination
      });
      setAnswer(response.data.answer);
    } catch (err) {
      setAnswer(`Error: ${err.response?.data?.details || err.message}`);
    } finally {
      setAskingQuestion(false);
    }
  };

  const formatItinerary = (text) => {
    if (!text || typeof text !== 'string') {
      return <p>No content available</p>;
    }
    
    // Simple formatting: preserve line breaks and add basic styling
    const lines = text.split('\n');
    return lines.map((line, index) => {
      if (line.startsWith('###')) {
        return <h3 key={index}>{line.replace('###', '').trim()}</h3>;
      } else if (line.startsWith('##')) {
        return <h2 key={index}>{line.replace('##', '').trim()}</h2>;
      } else if (line.startsWith('#')) {
        return <h2 key={index}>{line.replace('#', '').trim()}</h2>;
      } else if (line.trim().startsWith('-') || line.trim().startsWith('•')) {
        return <li key={index}>{line.replace(/^[-•]\s*/, '').trim()}</li>;
      } else if (line.trim()) {
        return <p key={index}>{line}</p>;
      }
      return <br key={index} />;
    });
  };

  return (
    <div className="app">
      <div className="container">
        <header className="header">
          <h1>✈️ AI Travel Itinerary Builder</h1>
          <p>Powered by ROMA - Create your perfect travel plan in seconds</p>
        </header>

        <div className="main-content">
          <div className="form-section">
            <h2>Plan Your Trip</h2>
            <form onSubmit={handleSubmit}>
              <div className="form-group">
                <label htmlFor="destination">Destination *</label>
                <input
                  type="text"
                  id="destination"
                  name="destination"
                  value={formData.destination}
                  onChange={handleInputChange}
                  placeholder="e.g., Paris, France"
                  required
                />
              </div>

              <div className="form-group">
                <label htmlFor="days">Number of Days</label>
                <input
                  type="number"
                  id="days"
                  name="days"
                  value={formData.days}
                  onChange={handleInputChange}
                  min="1"
                  max="30"
                  required
                />
              </div>

              <div className="form-group">
                <label htmlFor="budget">Budget Level</label>
                <select
                  id="budget"
                  name="budget"
                  value={formData.budget}
                  onChange={handleInputChange}
                >
                  <option value="budget">Budget ($)</option>
                  <option value="moderate">Moderate ($$)</option>
                  <option value="luxury">Luxury ($$$)</option>
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
                      {interest}
                    </label>
                  ))}
                </div>
              </div>

              <div className="form-group">
                <label htmlFor="additionalNotes">Additional Notes</label>
                <textarea
                  id="additionalNotes"
                  name="additionalNotes"
                  value={formData.additionalNotes}
                  onChange={handleInputChange}
                  placeholder="Any special requirements or preferences..."
                />
              </div>

              <button 
                type="submit" 
                className="generate-button"
                disabled={loading}
              >
                {loading ? 'Generating...' : '✨ Generate Itinerary'}
              </button>
            </form>
          </div>

          <div className="results-section">
            <h2>Your Itinerary</h2>
            {loading && (
              <div className="loading">
                <div className="spinner"></div>
                <p>ROMA is crafting your perfect itinerary...</p>
              </div>
            )}

            {error && (
              <div className="error">
                <h3>Error</h3>
                <p>{error}</p>
                <p style={{ fontSize: '0.9em', marginTop: '10px' }}>
                  Make sure the backend server is running and you have set up your API keys.
                </p>
              </div>
            )}

            {!loading && !error && !itinerary && (
              <div className="placeholder">
                <svg viewBox="0 0 24 24" fill="currentColor">
                  <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-2 15l-5-5 1.41-1.41L10 14.17l7.59-7.59L19 8l-9 9z"/>
                </svg>
                <h3>Ready to explore?</h3>
                <p>Fill in the form and click "Generate Itinerary" to get started!</p>
              </div>
            )}

            {itinerary && !loading && (
              <div className="itinerary-content">
                {formatItinerary(itinerary.itinerary)}
              </div>
            )}
          </div>
        </div>

        {itinerary && (
          <div className="question-section">
            <h3>Have a question about your trip?</h3>
            <form onSubmit={handleAskQuestion} className="question-form">
              <input
                type="text"
                className="question-input"
                value={question}
                onChange={(e) => setQuestion(e.target.value)}
                placeholder="Ask anything about your destination..."
              />
              <button 
                type="submit" 
                className="ask-button"
                disabled={askingQuestion}
              >
                {askingQuestion ? 'Asking...' : 'Ask'}
              </button>
            </form>
            {answer && (
              <div className="answer-box">
                <strong>Answer:</strong>
                <div>{formatItinerary(answer)}</div>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}

export default App;
