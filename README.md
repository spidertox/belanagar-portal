# Belanagar Digital Village Portal
1. `npm install`
2. `node scripts/hash.mjs "your-long-password"` → copy output into `ADMIN_PASSWORD_HASH`
3. Create a bot with @BotFather, message it once, find your chat id → `TELEGRAM_BOT_TOKEN`, `TELEGRAM_CHAT_ID` (use a private chat only for this bot)
4. Vercel → Settings → Environment Variables: `ADMIN_PASSWORD_HASH`, `SESSION_SECRET` (random, 32+ chars), `TELEGRAM_BOT_TOKEN`, `TELEGRAM_CHAT_ID`
5. Local testing: `npx vercel dev` (plain `vite` does not run /api). Deploy: `git push` to main.

Data lives in a JSON file that /api/router.js posts silently to the bot chat and pins; each save adds a new file. Contact messages go to the same chat. Only 1 serverless function is used.
