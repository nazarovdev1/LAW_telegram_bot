# Telegram Bot Project

## Project Type
Node.js/JavaScript (ES modules) - Telegram Bot using Telegraf library

## Main Entry Point
- `index.mjs` - Main bot application

## Key Dependencies
- telegraf: ^4.16.3 - Telegram bot framework
- dotenv: ^17.2.3 - Environment variables
- date-fns: ^4.1.0 - Date formatting with Uzbek locale

## Key Features
- Anonymous reporting bot with category selection
- Admin authentication with password
- Reports stored in JSON file (reports.json)
- Multi-language support (Uzbek)

## File Locations
- Config: `.env`
- Reports storage: `reports.json`
- Main code: `index.mjs`

## targetFramework
None (Node.js bot, not a web framework with built-in test runners)

## Important Notes
- Reports are persisted to `reports.json`
- User states are tracked in memory using Map()
- Admin authentication requires both chat ID match and password '123'