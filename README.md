# Twilio Phone - Next.js Web App

A minimal Next.js web application that allows you to make and receive calls using your Twilio phone number.

## Features

- 📞 Make outbound calls to any phone number
- 📱 Receive inbound calls in the browser
- 🔇 Mute/unmute during calls
- 🎨 Clean, responsive UI with Tailwind CSS
- 🔒 Secure token generation
- ⌨️ Interactive dialpad with DTMF support

## Prerequisites

- Node.js 18+ installed
- A Twilio account with:
  - Account SID
  - API Key (create one in Twilio Console)
  - TwiML App (for voice routing)
  - A Twilio phone number

## Setup Instructions

1. **Clone and install dependencies:**
   ```bash
   cd twilio-phone-app
   npm install
   ```

2. **Configure environment variables:**
   
   Copy `.env.example` to `.env.local` and fill in your Twilio credentials:
   ```
   TWILIO_ACCOUNT_SID=your_account_sid
   TWILIO_API_KEY_SID=your_api_key_sid
   TWILIO_API_KEY_SECRET=your_api_key_secret
   TWILIO_TWIML_APP_SID=your_twiml_app_sid
   TWILIO_PHONE_NUMBER=+1234567890
   ```

3. **Set up your TwiML App:**
   
   In the Twilio Console:
   - Create a new TwiML App
   - Set the Voice Request URL to: `https://your-domain.com/api/voice`
   - Use POST method
   - Save the TwiML App SID to your `.env.local`

4. **Configure your Twilio phone number:**
   
   - In Twilio Console, go to your phone number settings
   - Set the Voice webhook to use your TwiML App
   - This routes incoming calls to your web app

5. **For local development:**
   
   Use ngrok to expose your local server:
   ```bash
   ngrok http 3000
   ```
   
   Then update your TwiML App's Voice URL to:
   ```
   https://your-ngrok-url.ngrok.io/api/voice
   ```

6. **Start the development server:**
   ```bash
   npm run dev
   ```

   Open [http://localhost:3000](http://localhost:3000) in your browser.

## Usage

1. **Making calls:**
   - Enter a phone number using the dialpad or keyboard
   - Click the green "Call" button
   - The call will be placed from your Twilio number

2. **Receiving calls:**
   - Keep the web app open in your browser
   - When someone calls your Twilio number, you'll see an incoming call notification
   - Click "Accept" to answer or "Reject" to decline

3. **During a call:**
   - Use the red "Hang Up" button to end the call
   - Toggle mute/unmute with the mute button
   - Send DTMF tones by pressing dialpad buttons

## Project Structure

```
twilio-phone-app/
├── app/
│   ├── api/
│   │   ├── token/route.ts      # Generates Twilio access tokens
│   │   └── voice/route.ts      # Handles TwiML voice webhooks
│   ├── components/
│   │   └── Phone.tsx           # Main phone UI component
│   ├── hooks/
│   │   └── useTwilioDevice.ts  # Twilio Device management hook
│   ├── page.tsx                # Home page
│   └── layout.tsx              # Root layout
├── public/                     # Static assets
├── .env.local                  # Environment variables (create this)
└── package.json               # Dependencies
```

## Security Notes

- Never expose your Twilio credentials in client-side code
- The access token has a 1-hour expiration
- Each browser session gets a unique identity
- Use HTTPS in production

## Troubleshooting

1. **"Device not ready" error:**
   - Check your environment variables
   - Ensure all Twilio credentials are correct
   - Check browser console for specific errors

2. **Can't receive calls:**
   - Verify your TwiML App URL is correct
   - Check that your phone number is configured to use the TwiML App
   - Ensure your server is accessible (use ngrok for local testing)

3. **No audio:**
   - Check browser permissions for microphone access
   - Ensure you're using HTTPS (required for WebRTC)

## Production Deployment

When deploying to production:

1. Update your TwiML App Voice URL to your production domain
2. Ensure all environment variables are set in your hosting platform
3. Use HTTPS (required for WebRTC)
4. Consider implementing additional security measures:
   - Rate limiting on token generation
   - User authentication
   - Call logging and monitoring

## License

MIT