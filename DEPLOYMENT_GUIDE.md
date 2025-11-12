# 🚀 Telegram Bot Deployment Guide

Comprehensive guide for deploying your Telegram bot to stay always awake and optimal.

## 📋 Table of Contents
1. [Render Deployment (Recommended)](#1-render-deployment)
2. [Railway Deployment](#2-railway-deployment)
3. [GitHub Actions (Free 24/7)](#3-github-actions-free-247)
4. [Docker Deployment](#4-docker-deployment)
5. [Keep-Alive Services](#5-keep-alive-services)
6. [Monitoring Setup](#6-monitoring-setup)

---

## 1. Render Deployment (Recommended)

### Option A: Background Worker (No Sleep Issues)

**Best for bots that don't need HTTP endpoints**

1. Create account at [render.com](https://render.com)
2. Click "New" → "Background Worker"
3. Connect your GitHub repository
4. Configure:
   - **Name**: telegram-bot-worker
   - **Environment**: Node
   - **Build Command**: `npm install`
   - **Start Command**: `node index.mjs`
   - **Plan**: Free (or Starter for zero downtime)

5. Add Environment Variables:
   ```
   BOT_TOKEN=your_bot_token
   ADMIN_CHAT_ID=your_admin_chat_id
   NODE_ENV=production
   ```

6. Deploy!

✅ **Advantages**: 
- Background workers DON'T sleep on free plan
- Always running
- Auto-restart on crash

### Option B: Web Service (With Keep-Alive)

**If you need HTTP endpoints or monitoring**

1. Create "Web Service" instead
2. Same configuration as Worker, but add:
   ```
   PORT=10000
   ENABLE_SELF_PING=true
   APP_URL=https://your-app-name.onrender.com
   ```

3. Set **Health Check Path**: `/health`

⚠️ **Note**: Free web services sleep after 15 min inactivity. Use keep-alive services below.

---

## 2. Railway Deployment

1. Sign up at [railway.app](https://railway.app)
2. Click "New Project" → "Deploy from GitHub"
3. Select your repository
4. Add environment variables (same as Render)
5. Railway will auto-detect Node.js and deploy

**Free Tier**: $5 credit/month (enough for ~550 hours)

---

## 3. GitHub Actions (Free 24/7)

**Completely free, runs directly on GitHub**

### Setup:

1. Go to your GitHub repository
2. Settings → Secrets → Actions
3. Add secrets:
   - `BOT_TOKEN`: Your bot token
   - `ADMIN_CHAT_ID`: Your admin chat ID

4. The workflow file is already created: `.github/workflows/deploy-bot.yml`
5. Push to main/master branch to trigger

### How it works:
- Runs every 14 minutes (keeps bot alive)
- Each run lasts up to 6 hours
- Automatically restarts
- **Completely free forever**

⚠️ **Limitation**: 
- No persistent storage (reports.json will be lost on restart)
- Use external database for production

---

## 4. Docker Deployment

### Build and Run Locally:

```bash
# Build image
docker build -t telegram-bot .

# Run container
docker run -d \\
  --name telegram-bot \\
  --env-file .env \\
  --restart unless-stopped \\
  telegram-bot
```

### Deploy to Cloud:

**Render with Docker:**
1. Use Dockerfile instead of Node environment
2. Render auto-detects and builds

**Railway with Docker:**
1. Same - auto-detected

**DigitalOcean/AWS/GCP:**
1. Build image
2. Push to registry
3. Deploy on container service

---

## 5. Keep-Alive Services

### Free Services to Ping Your Bot:

#### Option 1: UptimeRobot (Recommended)
1. Sign up at [uptimerobot.com](https://uptimerobot.com)
2. Add New Monitor:
   - **Type**: HTTP(s)
   - **URL**: `https://your-app.onrender.com/health`
   - **Interval**: 5 minutes
3. Free tier: 50 monitors, 5-min checks

#### Option 2: Cron-job.org
1. Sign up at [cron-job.org](https://cron-job.org)
2. Create new cron job:
   - **URL**: Your health endpoint
   - **Schedule**: Every 10 minutes
3. Free: Unlimited jobs

#### Option 3: Self-Ping (Built-in)
Already implemented in the code:
```env
ENABLE_SELF_PING=true
APP_URL=https://your-app.onrender.com
```

#### Option 4: External Keep-Alive Script
Run `keep-alive.mjs` on your computer or another server:
```bash
node keep-alive.mjs
```

Edit the file to add your URLs first!

---

## 6. Monitoring Setup

### Health Check Endpoints:

Your bot now has these endpoints:

- `GET /` - Basic status
- `GET /health` - Health check (for monitors)
- `GET /ping` - Simple ping

### Monitor Logs:

**Render:**
- Dashboard → Your service → Logs

**Railway:**
- Dashboard → Your project → Deployment logs

**GitHub Actions:**
- Actions tab → Select workflow run

---

## 🎯 Recommended Setup Combinations

### For Zero Cost:
✅ **GitHub Actions** (24/7 free)
- No keep-alive needed
- Runs automatically
- Zero cost forever

### For Best Reliability:
✅ **Render Background Worker** (Free plan)
- Never sleeps
- Auto-restart
- Free forever

### For Production:
✅ **Render Starter Plan** ($7/month)
- Zero downtime
- Always on
- Better resources

OR

✅ **Railway** ($5 credit/month)
- Pay only for usage
- Fast deployment
- Great DX

---

## 🔧 Environment Variables Summary

```env
# Required
BOT_TOKEN=your_telegram_bot_token
ADMIN_CHAT_ID=your_admin_chat_id

# Optional
PORT=3000
NODE_ENV=production

# For web services with keep-alive
ENABLE_SELF_PING=true
APP_URL=https://your-app.onrender.com
```

---

## 📊 Resource Usage Optimization

Your bot is already optimized:
- ✅ Minimal Express server (only for health checks)
- ✅ Efficient polling with Telegraf
- ✅ Graceful shutdown handlers
- ✅ Memory-efficient state management
- ✅ Drops pending updates on restart

---

## 🚨 Troubleshooting

### Bot goes to sleep:
1. Use **Background Worker** instead of Web Service
2. Enable keep-alive services (UptimeRobot)
3. Set `ENABLE_SELF_PING=true`

### Bot crashes:
- Check logs for errors
- Verify environment variables
- Ensure BOT_TOKEN is valid

### Can't receive messages:
- Check if bot is running (visit health endpoint)
- Verify polling is active (check logs)
- Ensure no other instance is running (Telegram allows only one)

---

## 📝 Quick Start Checklist

- [ ] Install dependencies: `npm install`
- [ ] Copy `.env.example` to `.env`
- [ ] Add your `BOT_TOKEN` and `ADMIN_CHAT_ID`
- [ ] Test locally: `npm start`
- [ ] Choose deployment platform
- [ ] Deploy and set environment variables
- [ ] Set up UptimeRobot monitoring (if using web service)
- [ ] Test deployed bot

---

## 🎉 You're All Set!

Your bot will now run 24/7 without sleeping. Choose the deployment method that fits your needs!

**Questions?** Check logs or monitoring dashboards for issues.
