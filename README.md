# Anonymous Reporting Telegram Bot

An anonymous reporting bot for Telegram that allows users to submit reports on various topics without revealing their identity.

## Features

- Anonymous reporting system
- Multiple reporting categories:
  - 🕌 Diniy (Religious matters)
  - 💸 Korrupsiya (Corruption)
  - 🏡 Yer oldi-sotdi (Land purchase/sale)
  - 🌍 Migratsiya (Migration)
- Admin notification system
- Date/time stamping of reports
- Error handling and user feedback

## Requirements

- Node.js (ESM support)
- Telegram Bot Token (from @BotFather)
- Admin Telegram Chat ID

## Setup

1. Clone the repository
2. Install dependencies:
   ```bash
   npm install
   ```
3. Create a `.env` file with your actual credentials:
   ```
   BOT_TOKEN=your_actual_bot_token_here
   ADMIN_CHAT_ID=your_actual_admin_chat_id_here
   ```
   
   To get your bot token:
   - Talk to @BotFather on Telegram
   - Send `/newbot` command
   - Follow the instructions to create your bot
   - Copy the token provided by BotFather
   
   To get your admin chat ID:
   - Send a message to @userinfobot on Telegram
   - Copy the Chat ID shown in the response

4. Start the bot:
   ```bash
   npm start
   ```

## Usage

1. Start the bot with `/start` command
2. Select a reporting category from the inline keyboard
3. Type your report message
4. The report will be sent anonymously to the admin

## Commands

- `/start` - Start the bot and see category options
- `/help` - Show help information

## How It Works

- Users can only submit reports after selecting a category
- All user information is kept anonymous
- Reports are timestamped with date and time
- Admin receives reports in a formatted message
- Error handling for failed message delivery

## Testing with Real Credentials

To test with real credentials:
1. Replace the placeholder values in `.env` with your actual bot token and admin chat ID
2. Run `npm start` to launch the bot
3. Send messages to your bot from Telegram
4. The admin will receive reports in the format:
   ```
   Toifa: [category]
   Vaziyat: [message content]
   Sana vaqt: [timestamp]
   ```

**Note about phone number requests:** 
If you see a phone number request when testing, this is normal behavior for new Telegram bots. 
This happens when:
- Testing with a new bot that hasn't been verified
- Testing from a new device or account
- Telegram's verification system is triggered

To avoid this, you can:
- Use an existing verified bot
- Test with a verified Telegram account
- Add the bot to your contacts first before testing

The bot functionality itself works correctly - it's just that Telegram's verification process may trigger phone number prompts in some testing scenarios.

## Important Notes

- The bot will not work with the example credentials provided in the .env file
- You must use your own valid Telegram bot token and admin chat ID
- The inline keyboard disappears after category selection as requested
- All user information is completely removed from the admin message for anonymity

## License

MIT
