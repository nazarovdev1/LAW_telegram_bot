# 🚀 Quick Setup Guide

## Step 1: Install Dependencies

```bash
npm install
```

## Step 2: Configure Environment

1. Copy the example environment file:
```bash
cp .env.example .env
```

2. Edit `.env` and add your credentials:
```env
BOT_TOKEN=123456:ABC-DEF1234ghIkl-zyx57W2v1u123ew11
ADMIN_CHAT_ID=123456789
```

### How to get BOT_TOKEN:
1. Open Telegram
2. Search for `@BotFather`
3. Send `/newbot` command
4. Follow instructions
5. Copy the token

### How to get ADMIN_CHAT_ID:
1. Send a message to your bot
2. Visit: `https://api.telegram.org/bot<YOUR_BOT_TOKEN>/getUpdates`
3. Find `"chat":{"id":123456789}` in the response
4. Use that number

## Step 3: Test Locally

```bash
npm start
```

You should see:
```
Health check server running on port 3000
Anonymous reporting bot is running...
```

Test the bot:
1. Open Telegram
2. Search for your bot
3. Send `/start`

## Step 4: Deploy to Cloud

### Option A: Render (Recommended - Always Awake)

1. Go to [render.com](https://render.com)
2. Sign up with GitHub
3. Click "New" → "Background Worker"
4. Connect your repo
5. Set:
   - Build Command: `npm install`
   - Start Command: `node index.mjs`
6. Add environment variables:
   - `BOT_TOKEN`
   - `ADMIN_CHAT_ID`
7. Click "Create Background Worker"

✅ **Background workers never sleep!**

### Option B: GitHub Actions (100% Free)

1. Go to your GitHub repository
2. Settings → Secrets and variables → Actions
3. Add repository secrets:
   - `BOT_TOKEN`: Your bot token
   - `ADMIN_CHAT_ID`: Your admin chat ID
4. Push code to main/master branch
5. Go to Actions tab - bot will start automatically!

✅ **Runs 24/7 completely free!**

### Option C: Railway

1. Go to [railway.app](https://railway.app)
2. Sign in with GitHub
3. "New Project" → "Deploy from GitHub repo"
4. Select your repository
5. Add environment variables
6. Deploy!

## Step 5: Keep Bot Awake (For Web Services Only)

If you deployed as **Web Service** on Render:

### Method 1: UptimeRobot (Recommended)
1. Sign up at [uptimerobot.com](https://uptimerobot.com)
2. Add New Monitor:
   - Monitor Type: HTTP(s)
   - URL: `https://your-app.onrender.com/health`
   - Monitoring Interval: 5 minutes
3. Done! Your bot won't sleep

### Method 2: Built-in Self-Ping
Add to your `.env` on Render:
```env
ENABLE_SELF_PING=true
APP_URL=https://your-app.onrender.com
```

## 📊 Verify Deployment

Check if your bot is running:
1. Visit your health endpoint: `https://your-app.onrender.com/health`
2. Send message to bot on Telegram
3. Check logs in your platform dashboard

## 🔧 Troubleshooting

### Bot not responding
- Check logs in platform dashboard
- Verify `BOT_TOKEN` is correct
- Ensure no other instance is running
- Check bot privacy settings in BotFather

### "Bad Request: wrong file identifier" error
- Ignore - this is from old updates
- Bot will work normally

### Web service keeps sleeping
- Use **Background Worker** instead, OR
- Set up UptimeRobot monitoring, OR
- Enable `ENABLE_SELF_PING=true`

## 🎉 Done!

Your bot should now be running 24/7!

**Quick Test:**
1. Send `/start` to your bot
2. Select a category
3. Fill in the information
4. Check if admin receives the message

## 📚 Need More Help?

- Read full deployment guide: `DEPLOYMENT_GUIDE.md`
- Check bot logs on your platform
- Verify environment variables are set correctly

---

**Platform Comparison:**

| Platform | Free Tier | Always On | Best For |
|----------|-----------|-----------|----------|
| Render Worker | ✅ Yes | ✅ Yes | Production |
| Render Web | ✅ Yes | ⚠️ Needs ping | Development |
| GitHub Actions | ✅ Yes | ✅ Yes | Personal use |
| Railway | ⚠️ $5 credit | ✅ Yes | Small projects |

**Recommendation:** Use **Render Background Worker** for best reliability!
