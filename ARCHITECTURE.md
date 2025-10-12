# Travel Itinerary Builder - Architecture Overview

## 🏗️ System Architecture

```
┌─────────────────────────────────────────────────────────────────┐
│                         User Browser                             │
│                    (http://localhost:3000)                       │
└────────────────────────────┬────────────────────────────────────┘
                             │
                             │ HTTP/REST API
                             │
┌────────────────────────────▼────────────────────────────────────┐
│                      React Frontend                              │
│  ┌──────────────────────────────────────────────────────────┐  │
│  │  App.js (Main Component)                                  │  │
│  │  ├─ Form Section (Destination, Days, Budget, Interests)  │  │
│  │  ├─ Results Section (Displays Generated Itinerary)       │  │
│  │  └─ Q&A Section (Ask Follow-up Questions)                │  │
│  └──────────────────────────────────────────────────────────┘  │
│                             │                                    │
│                             │ Axios HTTP Client                  │
└────────────────────────────┬────────────────────────────────────┘
                             │
                             │ POST /api/generate-itinerary
                             │ POST /api/ask-question
                             │
┌────────────────────────────▼────────────────────────────────────┐
│                      Flask Backend                               │
│                    (http://localhost:5000)                       │
│  ┌──────────────────────────────────────────────────────────┐  │
│  │  app.py (Flask Application)                               │  │
│  │  ├─ /api/generate-itinerary endpoint                      │  │
│  │  ├─ /api/ask-question endpoint                            │  │
│  │  └─ CORS enabled for frontend communication               │  │
│  └─────────────────────┬────────────────────────────────────┘  │
└────────────────────────┼────────────────────────────────────────┘
                         │
                         │ Python API
                         │
┌────────────────────────▼────────────────────────────────────────┐
│                    ROMA Agent Framework                          │
│                  (sentientresearchagent)                         │
│  ┌──────────────────────────────────────────────────────────┐  │
│  │  SentientAgent.create()                                   │  │
│  │  └─ agent.run(prompt)                                     │  │
│  │                                                            │  │
│  │  Recursive Task Decomposition:                            │  │
│  │  1. Atomizer  - Decide if task is atomic                 │  │
│  │  2. Planner   - Break into subtasks                       │  │
│  │  3. Executors - Handle atomic tasks                       │  │
│  │  4. Aggregator - Combine results                          │  │
│  └─────────────────────┬────────────────────────────────────┘  │
└────────────────────────┼────────────────────────────────────────┘
                         │
                         │ LLM API Calls
                         │
┌────────────────────────▼────────────────────────────────────────┐
│                      OpenAI API                                  │
│                   (GPT-4 / GPT-3.5)                             │
│  ┌──────────────────────────────────────────────────────────┐  │
│  │  Processes prompts and generates responses                │  │
│  │  Returns comprehensive travel itineraries                 │  │
│  └──────────────────────────────────────────────────────────┘  │
└─────────────────────────────────────────────────────────────────┘
```

## 📊 Data Flow

### Generating an Itinerary

```
1. User Input (Frontend)
   ↓
   {
     destination: "Paris, France",
     days: 5,
     budget: "moderate",
     interests: ["Culture", "Food"],
     additionalNotes: "Vegetarian options"
   }
   ↓
2. HTTP POST to Backend
   ↓
3. Backend builds prompt for ROMA
   ↓
4. ROMA processes request:
   - Breaks into subtasks (attractions, food, transport, etc.)
   - Executes subtasks (potentially in parallel)
   - Aggregates results
   ↓
5. Backend returns JSON response
   ↓
6. Frontend displays formatted itinerary
```

### ROMA's Recursive Processing

```
User Request: "Create a 5-day itinerary for Paris"
   ↓
┌─────────────────────────────────────────────┐
│          Atomizer (Is task atomic?)         │
│                    NO                        │
└────────────────┬────────────────────────────┘
                 ↓
┌─────────────────────────────────────────────┐
│    Planner (Break into subtasks)            │
│    ├─ Research Paris attractions            │
│    ├─ Find restaurants & cafes              │
│    ├─ Plan transportation                   │
│    ├─ Research accommodation                │
│    └─ Calculate daily budget                │
└────────────────┬────────────────────────────┘
                 ↓
      ┌──────────┴──────────┐
      │   Execute subtasks   │ (Parallel)
      │   (Use LLM + Tools)  │
      └──────────┬──────────┘
                 ↓
┌─────────────────────────────────────────────┐
│    Aggregator (Combine results)             │
│    Creates coherent day-by-day itinerary    │
└─────────────────────────────────────────────┘
```

## 🔧 Component Breakdown

### Frontend Components

```javascript
App.js
├── State Management
│   ├── formData (user inputs)
│   ├── itinerary (generated plan)
│   ├── loading (UI state)
│   ├── question (Q&A state)
│   └── answer (Q&A response)
│
├── Form Section
│   ├── Destination input
│   ├── Days selector
│   ├── Budget dropdown
│   ├── Interests checkboxes
│   └── Additional notes textarea
│
├── Results Section
│   ├── Loading spinner
│   ├── Error display
│   ├── Itinerary content
│   └── Placeholder (empty state)
│
└── Q&A Section
    ├── Question input
    ├── Ask button
    └── Answer display
```

### Backend Endpoints

```python
app.py
├── /health (GET)
│   └── Returns: {"status": "healthy"}
│
├── /api/generate-itinerary (POST)
│   ├── Input: {destination, days, budget, interests, additionalNotes}
│   ├── Process: Builds prompt → ROMA agent → Generate itinerary
│   └── Output: {success, itinerary, destination, days, budget}
│
└── /api/ask-question (POST)
    ├── Input: {question, destination}
    ├── Process: Builds prompt → ROMA agent → Answer question
    └── Output: {success, answer}
```

## 🎯 ROMA Integration Points

### How ROMA Enhances the App

1. **Smart Decomposition**
   - Automatically breaks complex travel planning into manageable chunks
   - No need to manually orchestrate multiple API calls

2. **Parallel Processing**
   - ROMA can research multiple aspects simultaneously
   - Faster response times for complex queries

3. **Intelligent Synthesis**
   - Combines disparate information into coherent narratives
   - Creates well-structured, readable itineraries

4. **Flexible & Extensible**
   - Easy to add new capabilities (weather, bookings, etc.)
   - Just extend the prompt, ROMA handles the complexity

### Example: Behind the Scenes

When you request a Paris itinerary:

```
ROMA internally might:
1. Search for "best Paris attractions"
2. Research "Paris budget accommodations"
3. Find "vegetarian restaurants Paris"
4. Look up "Paris metro guide"
5. Check "Paris events calendar"

Then synthesizes all this into:
→ Day 1: Morning at Louvre, lunch at..., afternoon...
→ Day 2: Eiffel Tower visit, cafe at..., evening...
...and so on
```

## 🔐 Environment & Security

```
.env file structure:
├── OPENAI_API_KEY (Required)
├── ANTHROPIC_API_KEY (Optional)
├── GOOGLE_API_KEY (Optional)
└── FLASK_ENV (development/production)

Security considerations:
├── API keys stored in .env (not in code)
├── .env added to .gitignore
├── CORS configured for localhost only
└── No sensitive data in frontend
```

## 📈 Performance Considerations

- **Caching**: Could add Redis/memory cache for common destinations
- **Rate Limiting**: Implement to prevent API abuse
- **Streaming**: Could use streaming responses for real-time updates
- **Error Handling**: Robust error handling for network issues
- **Retry Logic**: Automatic retry on transient failures

## 🚀 Deployment Options

```
Development:
├── Frontend: npm start (localhost:3000)
└── Backend: python app.py (localhost:5000)

Production:
├── Frontend: Vercel, Netlify, or S3 + CloudFront
├── Backend: Heroku, Railway, AWS Lambda, or DigitalOcean
└── Database: Add PostgreSQL/MongoDB for saving itineraries
```

## 📚 Tech Stack Summary

| Layer | Technology | Purpose |
|-------|-----------|---------|
| Frontend | React 18 | User interface |
| Styling | CSS3 | Visual design |
| HTTP Client | Axios | API communication |
| Backend | Flask | REST API server |
| AI Framework | ROMA | Task decomposition & execution |
| LLM | OpenAI GPT | Natural language processing |
| Environment | Python venv | Dependency isolation |
| Package Manager | npm, pip | Dependency management |

---

This architecture provides a clean separation of concerns, making it easy to:
- ✅ Swap out the LLM provider (OpenAI → Anthropic → Local model)
- ✅ Add new features (save itineraries, share, export PDF)
- ✅ Scale horizontally (add load balancers, cache layers)
- ✅ Test independently (frontend, backend, ROMA integration)
