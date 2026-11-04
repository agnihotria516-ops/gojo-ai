# Gojo AI — Full AI + Voice Chat

This project includes:
- Real AI replies through Google's Gemini API (server-side; not hard-coded demo replies).
- Text chat with conversation context.
- Browser speech recognition for microphone input.
- Browser text-to-speech for spoken replies.
- Start Voice and Stop controls.
- Optional continuous listening.

## Important: what you need

1. A computer with Node.js 18 or newer (https://nodejs.org/).
2. Internet access.
3. A Gemini API key from Google AI Studio: https://aistudio.google.com/app/apikey
4. A modern browser. Voice input is best supported by Google Chrome.
5. Microphone permission.

The Gemini API key is secret. Never paste it into `public/index.html`, send it in chat, or publish it in a public repository.

## Run locally (Windows)

1. Extract the ZIP.
2. Open the extracted `gojo_ai_complete` folder.
3. In that folder, open Command Prompt / PowerShell.
4. Run:

   npm install

5. Set your API key for this terminal session:

   PowerShell:
   `$env:GEMINI_API_KEY="PASTE_YOUR_KEY_HERE"`

   Command Prompt:
   `set GEMINI_API_KEY=PASTE_YOUR_KEY_HERE`

6. Start the app:

   npm start

7. Open `http://localhost:3000` in Chrome.
8. Press **Start voice**, allow microphone access, and speak. Press **Stop** to stop listening and speech.

## Run locally (macOS / Linux)

```bash
npm install
export GEMINI_API_KEY="PASTE_YOUR_KEY_HERE"
npm start
```

Then open http://localhost:3000 in Chrome.

## Android note

The ZIP is a Node.js web app, not an installable APK. The simplest setup is to run the server on a computer and open its HTTPS address on your phone. You can also run Node.js in an Android development environment, but that setup is more involved. For microphone access on a phone, use Chrome and a secure context (localhost or HTTPS); a plain HTTP address on another device may block the microphone.

## Deploying online

Deploy the Node project to a trusted Node.js host that supports environment variables. Set `GEMINI_API_KEY` in the host's private environment-variable settings. Do not place the key in frontend code. Enable HTTPS, then open the deployed HTTPS URL.

## Troubleshooting

- **AI says API key missing:** Set `GEMINI_API_KEY` in the same terminal/session used to run `npm start`, then restart the server.
- **401 / invalid key:** Create a valid Gemini API key and check that it is enabled for the Gemini API.
- **429 / quota:** Check your API quota and billing/availability in Google AI Studio.
- **Microphone denied:** In Chrome site settings, allow Microphone, reload the page, and press Start voice again.
- **Voice input unsupported:** Use a recent Google Chrome build. Speech recognition support varies by browser/device and may use the browser vendor's speech service.
- **No spoken reply:** Make sure “Speak Gojo's replies” is checked and your phone/browser volume is up.
- **Port already in use:** Start with `PORT=3001` (macOS/Linux) or `$env:PORT="3001"` (PowerShell), then open port 3001.

## Privacy and safety

Voice recognition and speech synthesis are browser features. The typed conversation is sent to the configured Gemini API through this server. Do not enter passwords, private personal information, or sensitive data. API usage may be subject to Google's terms, availability, and quotas.
