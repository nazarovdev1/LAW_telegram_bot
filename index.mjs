import { Telegraf } from 'telegraf';
import dotenv from 'dotenv';
import express from 'express';
import { format } from 'date-fns';
import { uz } from 'date-fns/locale';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

// Get current directory for ES modules
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const reportsFilePath = path.join(__dirname, 'reports.json');

// Load environment variables
dotenv.config();

// Validate required environment variables
if (!process.env.BOT_TOKEN || !process.env.ADMIN_CHAT_ID) {
  console.error('Error: BOT_TOKEN and ADMIN_CHAT_ID must be set in .env file');
  process.exit(1);
}

// Create Express app
const app = express();
const PORT = process.env.PORT || 10000;

// Middleware
app.use(express.json());

// Health check endpoint
app.get('/', (req, res) => {
  res.json({
    status: 'ok',
    message: 'Telegram bot is running',
    uptime: process.uptime(),
    timestamp: new Date().toISOString()
  });
});

app.get('/health', (req, res) => {
  res.json({
    status: 'ok',
    message: 'Telegram bot is running',
    uptime: process.uptime(),
    timestamp: new Date().toISOString()
  });
});

// Create bot instance
const bot = new Telegraf(process.env.BOT_TOKEN);

// Store user states
const userStates = new Map();

// User state steps
const USER_STEPS = {
  SELECTING_CATEGORY: 'selecting_category',
  ENTERING_NAME: 'entering_name',
  ENTERING_CONTACT: 'entering_contact',
  ENTERING_MESSAGE: 'entering_message',
  CONFIRMING_SECRET: 'confirming_secret',
  ADMIN_SELECTING_USER: 'admin_selecting_user',
  ADMIN_WRITING_MESSAGE: 'admin_writing_message'
};

// Admin password
const ADMIN_PASSWORD = '1390011shox';

// Categories for reporting
const categories = [
  { name: '🕌 Diniy', value: 'Diniy' },
  { name: '💸 Korrupsiya', value: 'Korrupsiya' },
  { name: '🏡 Yer oldi-sotdi', value: 'Yer oldi-sotdi' },
  { name: '🌍 Migratsiya', value: 'Migratsiya' },
  { name: '📝 Boshqa mavzu', value: 'Boshqa mavzu' }
];

// Helper function to format date
const formatDate = (date) => {
  return format(date, 'dd.MM.yyyy HH:mm:ss', { locale: uz });
};

// Start command handler
bot.start((ctx) => {
  const welcomeMessage = "Assalomu alaykum! Siz bu bot orqali anonim tarzda murojaat yuborishingiz mumkin";

  const keyboard = {
    reply_markup: {
      inline_keyboard: categories.map(category => [
        { text: category.name, callback_data: category.value }
      ])
    }
  };

  return ctx.reply(welcomeMessage, keyboard);
});

// Admin command handler
bot.command('admin', (ctx) => {
  // Mark user as waiting for admin password
  userStates.set(ctx.from.id, { state: 'waiting_for_admin_password' });

  // Ask for password
  return ctx.reply('Parolni kiriting:');
});

// Help command handler
bot.help((ctx) => {
  const helpMessage = `
Bu bot orqali anonim murojaat yuborishingiz mumkin.

1. /start komandasini bosing
2. Toifalardan birini tanlang
3. Vaziyatni to'liq tavsiflang
4. Xabar adminga yuboriladi

Xabar yuborishda xato bo'lsa, xatolik haqida xabar beriladi.
  `;

  return ctx.reply(helpMessage);
});

// Handle category selection
bot.action(categories.map(c => c.value), async (ctx) => {
  const category = ctx.match[0];
  const userId = ctx.from.id;

  // Store user state and move to name collection step
  userStates.set(userId, {
    category,
    step: USER_STEPS.ENTERING_NAME,
    name: null,
    contact: null,
    message: null,
    isSecret: null
  });

  // Edit the message to remove the keyboard
  await ctx.editMessageReplyMarkup({ inline_keyboard: [] });

  return ctx.reply("Ismi familyangizni kiriting:");
});

// Admin /show command handler
bot.command('show', (ctx) => {
  const userId = ctx.from.id;
  const userState = userStates.get(userId);

  // Check if user is authenticated as admin
  if (!userState || userState.state !== 'admin_authenticated') {
    return ctx.reply('Siz admin emassiz.');
  }

  // Load all reports from JSON file
  const allReports = loadReports();

  if (allReports.length === 0) {
    return ctx.reply('Hozirda hech qanday xabar yuborilmagan.');
  }

  // Filter to show only complete reports (with category field)
  const completeReports = allReports.filter(report => report.category);

  if (completeReports.length === 0) {
    return ctx.reply('Hozirda hech qanday to\'liq xabar yuborilmagan.');
  }

  // Format reports for display with enhanced data
  let reportMessage = 'Yuborilgan to\'liq xabarlarni ro\'yxati:\n\n';
  completeReports.forEach((report, index) => {
    reportMessage += `${index + 1}. Toifa: ${report.category}\n`;
    if (report.name) reportMessage += `   Ismi: ${report.name}\n`;
    if (report.username) reportMessage += `   Username: @${report.username}\n`;
    if (report.contact) reportMessage += `   Telefon: ${report.contact}\n`;
    if (report.message) reportMessage += `   Vaziyat: ${report.message}\n`;
    if (report.isSecret !== undefined) reportMessage += `   Sir saqlansinmi: ${report.isSecret ? 'Ha' : 'Yo\'q'}\n`;
    if (report.timestamp) reportMessage += `   Sana vaqt: ${formatDate(new Date(report.timestamp))}\n`;
    if (report.user_id) reportMessage += `   Chat ID: ${report.user_id}\n`;
    reportMessage += '\n';
  });

  return ctx.reply(reportMessage);
});

// Admin /clear command handler
bot.command('clear', (ctx) => {
  const userId = ctx.from.id;
  const userState = userStates.get(userId);

  // Check if user is authenticated as admin
  if (!userState || userState.state !== 'admin_authenticated') {
    return ctx.reply('Siz admin emassiz.');
  }

  // Clear all reports
  clearReports();

  return ctx.reply('Barcha xabarlar tozalandi.');
});

// Admin /send command handler
bot.command('send', (ctx) => {
  const userId = ctx.from.id;
  const userState = userStates.get(userId);

  // Check if user is authenticated as admin
  if (!userState || userState.state !== 'admin_authenticated') {
    return ctx.reply('Siz admin emassiz.');
  }

  // Load all reports from JSON file
  const allReports = loadReports();

  if (allReports.length === 0) {
    return ctx.reply('Hozirda hech qanday foydalanuvchi topilmadi.');
  }

  // Get unique user IDs with their latest complete data
  const userMap = new Map();

  // Process all reports to get the most recent data for each user
  allReports.forEach(report => {
    if (report.user_id) {
      const existingUser = userMap.get(report.user_id);

      // If user not seen yet, or current report has more complete data, update
      if (!existingUser) {
        userMap.set(report.user_id, {
          user_id: report.user_id,
          name: report.name || 'Noma\'lum',
          contact: report.contact || 'Noma\'lum',
          lastCategory: report.category || 'Noma\'lum',
          timestamp: report.timestamp
        });
      } else {
        // Update with newer data if it's more complete
        if (report.name && report.name !== 'Noma\'lum') {
          existingUser.name = report.name;
        }
        if (report.contact && report.contact !== 'Noma\'lum') {
          existingUser.contact = report.contact;
        }
        if (report.category && report.category !== 'Noma\'lum') {
          existingUser.lastCategory = report.category;
        }
        // Keep the most recent timestamp
        if (report.timestamp && (!existingUser.timestamp || report.timestamp > existingUser.timestamp)) {
          existingUser.timestamp = report.timestamp;
        }
      }
    }
  });

  const uniqueUsers = Array.from(userMap.values());

  // Sort by most recent activity
  uniqueUsers.sort((a, b) => {
    if (!a.timestamp) return 1;
    if (!b.timestamp) return -1;
    return new Date(b.timestamp) - new Date(a.timestamp);
  });

  if (uniqueUsers.length === 0) {
    return ctx.reply('Hech qanday foydalanuvchi topilmadi.');
  }

  // Format user list
  let userListMessage = 'Foydalanuvchilar ro\'yxati:\n\n';
  uniqueUsers.forEach((user, index) => {
    userListMessage += `${index + 1}. ${user.name}\n`;
    userListMessage += `   Chat ID: ${user.user_id}\n`;
    userListMessage += `   Telefon: ${user.contact}\n`;
    userListMessage += `   So\'nggi toifa: ${user.lastCategory}\n\n`;
  });

  userListMessage += 'Foydalanuvchi raqamini kiriting (masalan: 1, 2, 3):';

  // Store user list in admin state
  userStates.set(userId, {
    state: 'admin_authenticated',
    step: USER_STEPS.ADMIN_SELECTING_USER,
    userList: uniqueUsers
  });

  return ctx.reply(userListMessage);
});

// Handle text messages
bot.on('text', async (ctx) => {
  const userId = ctx.from.id;
  const userState = userStates.get(userId);
  const messageText = ctx.message.text;

  // Skip command messages - let command handlers process them
  if (messageText.startsWith('/')) {
    return;
  }

  // Check if user is waiting for admin password
  if (userState && userState.state === 'waiting_for_admin_password') {
    if (messageText === ADMIN_PASSWORD) {
      // Correct password - set admin authenticated state
      userStates.set(userId, { state: 'admin_authenticated' });

      // Send admin menu
      const adminMenu = `
Admin menyusi:
1. /stats - Statistika
2. /clear - Barcha foydalanuvchilarni tozalash
3. /show - Foydalanuvchilar yuborgan xabarlarni ko'rish
4. /send - Foydalanuvchiga xabar yuborish
      `;
      return ctx.reply(adminMenu);
    } else {
      // Incorrect password
      return ctx.reply('Noto\'g\'ri parol. Qaytadan urinib ko\'ring.');
    }
  }

  // Handle enhanced user registration flow
  if (userState && userState.step) {
    switch (userState.step) {
      case USER_STEPS.ADMIN_SELECTING_USER:
        // Admin is selecting a user by number
        const userNumber = parseInt(messageText);

        if (isNaN(userNumber) || userNumber < 1 || userNumber > userState.userList.length) {
          return ctx.reply(`Noto'g'ri raqam. Iltimos, 1 dan ${userState.userList.length} gacha raqam kiriting.`);
        }

        // Store selected user
        const selectedUser = userState.userList[userNumber - 1];
        userState.selectedUser = selectedUser;
        userState.step = USER_STEPS.ADMIN_WRITING_MESSAGE;
        userStates.set(userId, userState);

        return ctx.reply(`Tanlangan foydalanuvchi: ${selectedUser.name}\n\nYubormoqchi bo'lgan xabaringizni yozing:`);

      case USER_STEPS.ADMIN_WRITING_MESSAGE:
        // Admin is writing the message to send
        const targetUserId = userState.selectedUser.user_id;
        const messageToSend = messageText;

        try {
          // Send message to selected user
          await bot.telegram.sendMessage(targetUserId, messageToSend);

          // Confirm to admin
          await ctx.reply(`✅ Xabar muvaffaqiyatli yuborildi!\n\nFoydalanuvchi: ${userState.selectedUser.name}\nChat ID: ${targetUserId}`);

          // Reset admin state
          userStates.set(userId, { state: 'admin_authenticated' });
        } catch (error) {
          console.error('Error sending message to user:', error);
          await ctx.reply(`❌ Xabarni yuborishda xatolik yuz berdi.\n\nXatolik: ${error.message}`);

          // Reset admin state
          userStates.set(userId, { state: 'admin_authenticated' });
        }
        return;

      case USER_STEPS.ENTERING_NAME:
        // Store name and move to contact step
        userState.name = messageText;
        userState.step = USER_STEPS.ENTERING_CONTACT;
        userStates.set(userId, userState);

        return ctx.reply("Telefon raqamingizni kiriting yoki pastdan tugmasini bosing:", {
          reply_markup: {
            keyboard: [
              [{ text: "📞 Kontaktni ulashish", request_contact: true }]
            ],
            resize_keyboard: true,
            one_time_keyboard: true
          }
        });

      case USER_STEPS.ENTERING_CONTACT:
        // Store contact and move to message step
        userState.contact = messageText;
        userState.step = USER_STEPS.ENTERING_MESSAGE;
        userStates.set(userId, userState);

        // Remove custom keyboard
        return ctx.reply("Endi vaziyatni to'liq yozib bering. Sizning shaxsingiz sir saqlanadi.", {
          reply_markup: { remove_keyboard: true }
        });

      case USER_STEPS.ENTERING_MESSAGE:
        // Store message and move to secret confirmation step
        userState.message = messageText;
        userState.step = USER_STEPS.CONFIRMING_SECRET;
        userStates.set(userId, userState);

        return ctx.reply("Xabaringiz sir saqlansinmi?", {
          reply_markup: {
            inline_keyboard: [
              [
                { text: "✅ Ha, sir saqlansin", callback_data: 'secret_yes' },
                { text: "❌ Yo'q, oshkor qilinsin", callback_data: 'secret_no' }
              ]
            ]
          }
        });
    }
  }

  // If user hasn't selected a category, send help
  return ctx.reply("Iltimos, /start komandasini bosing va toifani tanlang.");
});

// Handle contact sharing
bot.on('contact', async (ctx) => {
  const userId = ctx.from.id;
  const userState = userStates.get(userId);

  if (userState && userState.step === USER_STEPS.ENTERING_CONTACT) {
    // Store contact from the shared contact
    userState.contact = ctx.message.contact.phone_number;
    userState.username = ctx.from?.username || null;
    userState.step = USER_STEPS.ENTERING_MESSAGE;
    userStates.set(userId, userState);

    return ctx.reply("Endi vaziyatni to'liq yozib bering. Sizning shaxsingiz sir saqlanadi.", {
      reply_markup: { remove_keyboard: true }
    });
  }
});

// Handle secret confirmation
bot.action(['secret_yes', 'secret_no'], async (ctx) => {
  const userId = ctx.from.id;
  const userState = userStates.get(userId);
  const isSecret = ctx.match[0] === 'secret_yes';

  if (userState && userState.step === USER_STEPS.CONFIRMING_SECRET) {
    // Store secret preference
    userState.isSecret = isSecret;
    userStates.set(userId, userState);

    // Prepare message for admin
    const adminMessage = `
Toifa: ${userState.category}
Ismi: ${userState.name}
Telefon: ${userState.contact}
Vaziyat: ${userState.message}
Sir saqlansinmi: ${isSecret ? 'Ha' : 'Yo\'q'}
Sana vaqt: ${formatDate(new Date())}
Chat ID: ${userId}
    `.trim();

    // Save report to JSON file with enhanced data including chat_id
    const report = {
      category: userState.category,
      name: userState.name,
      contact: userState.contact,
      message: userState.message,
      isSecret: isSecret,
      timestamp: new Date().toISOString(),
      user_id: userId,
      username: ctx.from?.username || null
    };
    saveReport(report);

    try {
      // Send message to admin
      await bot.telegram.sendMessage(process.env.ADMIN_CHAT_ID, adminMessage);

      // Send confirmation to user - use reply instead of edit to avoid errors
      await ctx.reply("Xabar muvaffaqiyatli yuborildi!✅ biz bu muammoni 1 hafta ichida hal qilamiz.");

      // Clear user state
      userStates.delete(userId);
    } catch (error) {
      console.error('Error sending message:', error);
      // Only show error if it's not a "message not modified" error
      if (!error.message.includes('message is not modified')) {
        await ctx.reply("Uzr, xabarni yuborishda xatolik yuz berdi.");
      } else {
        // If it's just a "message not modified" error, still show success
        await ctx.reply("Xabar muvaffaqiyatli yuborildi!✅ biz bu muammoni 1 hafta ichida hal qilamiz.");
        userStates.delete(userId);
      }
    }
  }
});

// Handle errors
bot.catch((err) => {
  console.error('Bot error:', err);
});

// Save report to JSON file
const saveReport = (report) => {
  try {
    // Load existing reports
    let reports = [];
    if (fs.existsSync(reportsFilePath)) {
      const fileData = fs.readFileSync(reportsFilePath, 'utf-8');
      reports = JSON.parse(fileData);
    }

    // Add new report
    reports.push(report);

    // Save to file
    fs.writeFileSync(reportsFilePath, JSON.stringify(reports, null, 2), 'utf-8');
    console.log('Report saved to JSON file');
  } catch (error) {
    console.error('Error saving report to JSON file:', error);
  }
};

// Load reports from JSON file
const loadReports = () => {
  try {
    if (fs.existsSync(reportsFilePath)) {
      const fileData = fs.readFileSync(reportsFilePath, 'utf-8');
      return JSON.parse(fileData);
    }
    return [];
  } catch (error) {
    console.error('Error loading reports from JSON file:', error);
    return [];
  }
};

// Clear all reports
const clearReports = () => {
  try {
    fs.writeFileSync(reportsFilePath, JSON.stringify([], null, 2), 'utf-8');
    console.log('Reports cleared');
  } catch (error) {
    console.error('Error clearing reports:', error);
  }
};

// Set webhook
const domain = process.env.RENDER_EXTERNAL_URL;

if (domain) {
  const webhookUrl = `${domain}/telegraf/${process.env.BOT_TOKEN}`;
  bot.telegram.setWebhook(webhookUrl).then(() => {
    console.log('Webhook set to:', webhookUrl);
  }).catch(err => {
    console.error('Failed to set webhook:', err);
  });
} else {
  console.warn('⚠️ WARNING: RENDER_EXTERNAL_URL is not defined.');
  console.warn('Webhook was NOT set. The bot will not receive updates via webhook.');
  console.warn('If you are on Render.com, this variable is usually set automatically or you should set it in Environment Variables.');
}

// Set up webhook callback for Express
app.use(bot.webhookCallback(`/telegraf/${process.env.BOT_TOKEN}`));

// Start server
// Start server
app.listen(PORT, '0.0.0.0', () => {
  console.log(`Server running on port ${PORT}`);
});

// Handle unexpected errors
process.on('unhandledRejection', (reason, promise) => {
  console.error('Unhandled Rejection at:', promise, 'reason:', reason);
});

process.on('uncaughtException', (error) => {
  console.error('Uncaught Exception:', error);
});
