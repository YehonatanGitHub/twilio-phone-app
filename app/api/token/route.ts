import { NextResponse } from 'next/server'
import twilio from 'twilio'

const AccessToken = twilio.jwt.AccessToken
const VoiceGrant = AccessToken.VoiceGrant

export async function GET() {
  try {
    const accountSid = process.env.TWILIO_ACCOUNT_SID!
    const apiKeySid = process.env.TWILIO_API_KEY_SID!
    const apiKeySecret = process.env.TWILIO_API_KEY_SECRET!
    const twimlAppSid = process.env.TWILIO_TWIML_APP_SID!

    console.log('Token generation - Account SID:', accountSid)
    console.log('Token generation - API Key SID:', apiKeySid)
    console.log('Token generation - TwiML App SID:', twimlAppSid)

    // Use a fixed identity for incoming calls to work
    const identity = 'browser-client'

    // Create access token with credentials
    const token = new AccessToken(
      accountSid,
      apiKeySid,
      apiKeySecret,
      { 
        identity: identity,
        ttl: 3600 // 1 hour in seconds
      }
    )

    // Create a Voice grant
    const voiceGrant = new VoiceGrant({
      outgoingApplicationSid: twimlAppSid,
      incomingAllow: true
    })

    // Add the grant to the token
    token.addGrant(voiceGrant)

    // Generate the JWT
    const jwt = token.toJwt()
    
    console.log('Generated token:', jwt.substring(0, 50) + '...')
    console.log('Token identity:', identity)
    
    // Return the token
    return NextResponse.json({ 
      token: jwt,
      identity 
    })
  } catch (error) {
    console.error('Error generating token:', error)
    return NextResponse.json(
      { error: 'Failed to generate token' },
      { status: 500 }
    )
  }
}