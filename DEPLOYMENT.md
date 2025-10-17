# 🚀 Deployment Guide: Vercel (Frontend) + Render (Backend)

This guide will help you deploy your React frontend to **Vercel** and Flask backend to **Render**.

## Prerequisites
- GitHub account (with your repo pushed)
- Vercel account ([vercel.com](https://vercel.com))
- Render account ([render.com](https://render.com))
- OpenRouter API key

## Architecture Overview

```
Frontend (Vercel)          Backend (Render)
vercel.app domain          onrender.com domain
     ↓                           ↓
  React App  ←------API calls-----→  Flask API
```

## Deployment Steps

### Step 1: Deploy Backend on Render

### Step 1: Deploy Backend on Render

#### Deploy Backend API on Render

1. Go to [Render Dashboard](https://dashboard.render.com)
2. Click **"New +"** → **"Web Service"**
3. Connect your GitHub repository
4. Configure the backend service:
   - **Name**: `travel-itinerary-api`
   - **Environment**: `Python 3`
   - **Region**: `Ohio` (or closest to you)
   - **Branch**: `main`
   - **Root Directory**: `backend`
   - **Build Command**: `pip install -r requirements.txt`
   - **Start Command**: `gunicorn app:app`
   - **Plan**: Free (or Paid if needed)

5. Add Environment Variables:
   - Click **"Advanced"** → **"Add Environment Variable"**
   - **Key**: `OPENROUTER_API_KEY`
   - **Value**: Your OpenRouter API key
   - Add any other env vars your app needs

6. Click **"Create Web Service"** and wait for deployment

7. **Copy the deployed URL** (e.g., `https://travel-itinerary-api.onrender.com`) - **You'll need this for the frontend!**

### Step 2: Deploy Frontend on Vercel

#### Deploy Frontend on Vercel

1. Go to [Vercel Dashboard](https://vercel.com/dashboard)
2. Click **"Add New"** → **"Project"**
3. Select your GitHub repository
4. Configure project settings:
   - **Framework Preset**: Select **"React"** (or **"Create React App"** if available)
   - **Root Directory**: `frontend`
   - **Build Command**: `npm run build` (auto-detected)
   - **Output Directory**: `build` (auto-detected)
   - **Install Command**: `npm install` (auto-detected)

5. Add Environment Variables:
   - Click **"Environment Variables"** (before deploying)
   - **Name**: `REACT_APP_API_URL`
   - **Value**: Your backend URL from Step 1 (e.g., `https://travel-itinerary-api.onrender.com`)
   - Click **"Add"**

6. Click **"Deploy"** and wait for completion

7. Your frontend will be available at `https://your-frontend-project.vercel.app`

## Configuration Summary

| Component | Platform | URL Pattern |
|-----------|----------|------------|
| **Backend** | Render | `https://travel-itinerary-api.onrender.com` |
| **Frontend** | Vercel | `https://your-project.vercel.app` |
| **API Connection** | Environment Variable | `REACT_APP_API_URL` on Vercel |

## Environment Variables Reference

### Backend (Render)
Set in Render dashboard under **Environment Variables**:
```
OPENROUTER_API_KEY=your-key-here
```

### Frontend (Vercel)
Set in Vercel dashboard under **Settings** → **Environment Variables**:
```
REACT_APP_API_URL=https://travel-itinerary-api.onrender.com
```

## Testing the Deployment

1. **Test Backend API**:
   - Visit your Render backend URL directly
   - Check the logs in Render dashboard if there are issues

2. **Test Frontend**:
   - Visit your Vercel frontend URL
   - Open browser DevTools (F12)
   - Try creating an itinerary
   - Check Network tab to verify API calls are going to Render backend
   - Check Console for any errors

3. **Test Full Integration**:
   - Fill out the form on your frontend
   - Verify the request goes to your Render backend
   - Verify the response comes back and displays properly

## Troubleshooting

### Backend (Render) Issues

#### Build Errors
- Check that `backend/requirements.txt` has all dependencies
- Verify `gunicorn` is in requirements.txt
- Check Render logs for specific error messages

#### Runtime Errors
- Go to Render dashboard → Your service → **Logs**
- Look for Python error messages
- Ensure environment variables are set correctly
- Test locally first: `gunicorn app:app` from backend directory

#### API Timeout
- OpenRouter API calls might be slow
- Render free tier has no strict timeout limits (unlike Vercel)
- Consider upgrading to paid plan if timeouts persist

### Frontend (Vercel) Issues

#### Build Errors
- Ensure all npm dependencies are listed in `frontend/package.json`
- Check that `npm run build` works locally
- Review Vercel build logs

#### Environment Variable Not Working
- Verify `REACT_APP_API_URL` is set in Vercel environment variables
- **Important**: Vercel requires variables prefixed with `REACT_APP_` for frontend access
- Redeploy after adding environment variables (or trigger new deployment)

#### CORS Errors
- Check that backend has `CORS(app)` enabled (✓ already in your setup)
- Verify frontend is using correct backend URL from environment variable
- Check browser console for specific CORS error messages

#### API Connection Fails
- Verify `REACT_APP_API_URL` matches your Render backend URL exactly
- Check Network tab in DevTools - what URL is the request going to?
- Ensure Render backend is running and not in a cold start

### Both Issues

#### Slow Cold Starts
- **Render**: Free tier services spin down after 15 minutes of inactivity, causing ~30s cold start
- **Vercel**: Usually quick, <5s
- **Solution**: Upgrade to paid plans for production, or use monitoring services

#### CORS Still Not Working
1. Backend should have:
   ```python
   from flask_cors import CORS
   CORS(app)  # Enable for all routes
   ```
   ✓ Already configured in your setup

2. Frontend should use correct backend URL:
   ```javascript
   const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:5000';
   ```
   ✓ Already updated

3. If still issues, explicitly allow your Vercel domain:
   ```python
   CORS(app, origins=["https://your-frontend.vercel.app"])
   ```

## Redeploying After Changes

### To Redeploy Backend (Render)
1. Push changes to GitHub
2. Render automatically redeploys on push (can be configured)
3. Or manually: Render dashboard → Your service → **Manual Deploy**

### To Redeploy Frontend (Vercel)
1. Push changes to GitHub
2. Vercel automatically redeploys on push
3. Or manually: Vercel dashboard → Your project → Scroll down → Deployments → Redeploy

### To Update Environment Variables

**Render Backend**:
1. Go to your service
2. Click **Settings** → **Environment**
3. Edit variable
4. Click **"Save"** → Automatically redeploys

**Vercel Frontend**:
1. Go to your project
2. Click **Settings** → **Environment Variables**
3. Edit variable
4. Save
5. Manual deploy to apply changes

## Production Recommendations

| Aspect | Current Setup | Production Upgrade |
|--------|---------------|-------------------|
| **Render Backend** | Free tier (can spin down) | Paid tier ($7+/month) |
| **Vercel Frontend** | Free tier | Free tier is fine, or Pro ($20/month) |
| **Monitoring** | None | Add Sentry/LogRocket |
| **Domain** | Render/Vercel domains | Custom domain (costs extra) |
| **Database** | None (API only) | Consider adding if needed |

## Useful Links

- [Vercel Docs](https://vercel.com/docs)
- [Render Docs](https://render.com/docs)
- [Deploying React on Vercel](https://vercel.com/guides/deploying-react-with-vercel)
- [Deploying Flask on Render](https://render.com/docs/deploy-flask)
- [Environment Variables Best Practices](https://12factor.net/config)
