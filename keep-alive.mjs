/**
 * External Keep-Alive Service
 * Run this separately or use services like UptimeRobot, Cron-job.org
 */

import https from 'https';
import http from 'http';

const PING_URLS = [
  // Add your deployed bot URLs here
  'https://your-app-name.onrender.com/health',
  // 'https://your-backup-bot.railway.app/ping'
];

const PING_INTERVAL = 13 * 60 * 1000; // 13 minutes

function pingUrl(url) {
  const protocol = url.startsWith('https') ? https : http;
  
  return new Promise((resolve, reject) => {
    protocol.get(url, (res) => {
      console.log(`✅ Pinged ${url} - Status: ${res.statusCode}`);
      resolve(res.statusCode);
    }).on('error', (err) => {
      console.error(`❌ Error ping ${url}:`, err.message);
      reject(err);
    });
  });
}

async function keepAlive() {
  console.log(`🔄 Pinging ${PING_URLS.length} services...`);
  
  for (const url of PING_URLS) {
    try {
      await pingUrl(url);
    } catch (error) {
      // Continue even if one fails
    }
  }
  
  console.log(`⏰ Next ping in ${PING_INTERVAL / 60000} minutes\n`);
}

// Start immediately
keepAlive();

// Then repeat at intervals
setInterval(keepAlive, PING_INTERVAL);

console.log('🚀 Keep-alive service started');
