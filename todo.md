# TODO LIST - Enhanced User Registration & Message Flow

- [x] Analyze current codebase structure
- [x] Examine existing bot configuration and setup
- [x] Understand current user management system
- [x] Modify bot to support broadcast functionality for "Korrupsiya" category
- [x] Add configuration for broadcast user IDs (Users 2 and 3)
- [x] Implement message broadcasting when Korrupsiya is selected
- [x] Test the functionality (starting the bot)
- [x] Identify the issue: Messages are being broadcast to all users
- [x] Remove BROADCAST_CHAT_IDS configuration
- [x] Remove broadcast parsing functionality from code
- [x] Remove broadcastMessage function
- [x] Remove broadcast call from message handler
- [x] Ensure each user only sees their own messages
- [x] Fix bot conflict error (Telegram 409: Conflict)
- [x] Stop existing bot instances using PowerShell
- [x] Restart bot properly (bot was running successfully)
- [x] Enhanced user registration flow requirements defined
- [x] Add user steps constants
- [x] Implement name/surname collection step
- [x] Add contact sharing functionality
- [x] Add secret message confirmation step
- [x] Update data structure for new fields
- [x] Add contact handler for phone number sharing
- [x] Add secret confirmation handler
- [ ] Test the new flow
- [ ] Verify results

## New User Flow Implementation:
✅ 1. User /start → selects category (e.g., "Korrupsiya")
✅ 2. Bot asks: "Ismi familyangizni kiriting" (Enter your name and surname)
✅ 3. Bot asks: "Telefon raqamingizni kiriting yoki pastdan tugmasini bosing:" + "📞 Kontaktni ulashish" button
✅ 4. User shares contact → automatically sent to bot
✅ 5. User writes their message
✅ 6. Bot asks: "Xabaringiz sir saqlansinmi?" with yes/no buttons
✅ 7. User selects → data sent to reports.json with secret flag

## Enhanced Data Structure:
- category: string
- name: string
- contact: string
- message: string
- isSecret: boolean
- timestamp: ISO string

## Current Status:
🔄 Ready to test the new enhanced user registration and message flow
