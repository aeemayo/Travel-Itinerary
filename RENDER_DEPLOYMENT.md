# 🚀 Deploying to Render

This guide will help you deploy both your Flask backend and React frontend to Render.

## Prerequisites
- GitHub account (with your repo pushed)
- Render account ([render.com](https://render.com))
- OpenRouter API key

## Deployment Steps

### Option 1: Separate Services (Recommended)

#### 1. Deploy Backend API

1. Go to [Render Dashboard](https://dashboard.render.com)
2. Click **"New +"** → **"Web Service"**
3. Connect your GitHub repository
4. Configure the backend service:
   - **Name**: `travel-itinerary-api`
   - **Environment**: `Python 3`
   - **Region**: `Ohio` (or closest to you)
   - **Branch**: `main`
   - **Build Command**: `pip install -r requirements.txt`
   - **Start Command**: `gunicorn app:app`
   - **Plan**: Free (or Paid if needed)

5. Add Environment Variables:
   - Click **"Advanced"** → **"Add Environment Variable"**
   - **Key**: `OPENROUTER_API_KEY`
   - **Value**: Your OpenRouter API key
   - Add any other env vars your app needs

6. Click **"Create Web Service"** and wait for deployment

7. **Copy the deployed URL** (e.g., `https://travel-itinerary-api.onrender.com`)

#### 2. Deploy Frontend

1. Click **"New +"** → **"Web Service"**
2. Connect your GitHub repository
3. Configure the frontend service:
   - **Name**: `travel-itinerary-web`
   - **Environment**: `Node`
   - **Region**: `Ohio` (same as backend)
   - **Branch**: `main`
   - **Root Directory**: `frontend`
   - **Build Command**: `npm install && npm run build`
   - **Start Command**: `npm start`
   - **Plan**: Free

4. Add Environment Variables:
   - **Key**: `REACT_APP_API_URL`
   - **Value**: Your backend API URL (from step 1.7)
   - Example: `https://travel-itinerary-api.onrender.com`

5. Click **"Create Web Service"** and wait for deployment

6. Your frontend will be available at `https://travel-itinerary-web.onrender.com`

### Option 2: Monorepo (Single Service)

If you prefer to serve both from one service:

1. Update your Flask app to serve the built React files
2. In `backend/app.py`, add:

```python
import os
from flask import send_from_directory

# Serve React static files
@app.route('/', defaults={'path': ''})
@app.route('/<path:path>')
def serve_react(path):
    if path != "" and os.path.exists(os.path.join('frontend/build', path)):
        return send_from_directory('frontend/build', path)
    return send_from_directory('frontend/build', 'index.html')
```

3. Update your Render.yaml in root:

```yaml
services:
  - type: web
    name: travel-itinerary
    env: python
    region: ohio
    buildCommand: |
      cd frontend && npm install && npm run build && cd ..
      pip install -r backend/requirements.txt
    startCommand: gunicorn backend.app:app
    envVars:
      - key: OPENROUTER_API_KEY
        value: your-api-key
```

## Troubleshooting

### Build Errors
- Check that `requirements.txt` has all dependencies
- Ensure `package.json` has all npm dependencies
- Verify `gunicorn` is in `requirements.txt`

### Runtime Errors
- Check Render **Logs** tab for error messages
- Verify environment variables are set
- Test locally first: `gunicorn app:app` from backend directory

### CORS Issues
- Ensure `flask-cors` is installed (✓ already in your setup)
- Check that `REACT_APP_API_URL` environment variable matches your backend URL

### Application isn't responding
- Cold starts on free tier can take 30+ seconds
- Paid plans have better performance

## Environment Variables Reference

### Backend (.env)
```
OPENROUTER_API_KEY=your-key-here
```

### Frontend (Render UI)
```
REACT_APP_API_URL=https://your-backend.onrender.com
```

## Useful Render Commands & Info

- **Logs**: View in Render dashboard under your service
- **Redeploy**: Click "Manual Deploy" → "Deploy Latest Commit"
- **Environment Variables**: Update anytime without redeploying (most cases)
- **Restart Service**: Use "Manual Deploy" or service settings

## Post-Deployment

1. Test your API: Visit `https://your-api.onrender.com/health` (if you have a health endpoint)
2. Test frontend: Visit `https://your-web.onrender.com`
3. Try creating an itinerary to ensure backend connection works
4. Monitor logs for any errors

## Cost Info

- **Free Tier**: Limited resources, spins down after 15 min inactivity
- **Paid Plans**: Starting at $7/month, better for production
- Consider upgrading if you get significant traffic

## Additional Resources

- [Render Docs](https://render.com/docs)
- [Deploying Flask Apps](https://render.com/docs/deploy-flask)
- [Deploying React Apps](https://render.com/docs/deploy-react)
- [Environment Variables](https://render.com/docs/environment-variables)
