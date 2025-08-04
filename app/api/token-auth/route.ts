import { NextResponse } from 'next/server'
import twilio from 'twilio'

const AccessToken = twilio.jwt.AccessToken
const VoiceGrant = AccessToken.VoiceGrant

// This endpoint uses Auth Token instead of API Key for testing
export async function GET() {
  try {
    const accountSid = process.env.TWILIO_ACCOUNT_SID!
    const authToken = process.env.TWILIO_AUTH_TOKEN // You'll need to add this temporarily
    const twimlAppSid = process.env.TWILIO_TWIML_APP_SID!

    if (!authToken) {
      return NextResponse.json({ 
        error: 'Add TWILIO_AUTH_TOKEN to .env.local temporarily for testing' 
      }, { status: 400 })
    }

    // When using auth token, use account SID as both account SID and API key SID
    const identity = 'test-user-auth'
    const token = new AccessToken(
      accountSid,
      accountSid, // Use account SID as API key SID
      authToken,  // Use auth token as secret
      { identity }
    )

    const voiceGrant = new VoiceGrant({
      outgoingApplicationSid: twimlAppSid,
      incomingAllow: true
    })

    token.addGrant(voiceGrant)

    return NextResponse.json({ 
      token: token.toJwt(),
      identity,
      note: 'Using Auth Token for testing'
    })
  } catch (error: any) {
    console.error('Auth token test error:', error)
    return NextResponse.json({ 
      error: error.message 
    }, { status: 500 })
  }
}