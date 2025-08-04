import { NextResponse } from 'next/server'
import twilio from 'twilio'

const AccessToken = twilio.jwt.AccessToken
const VoiceGrant = AccessToken.VoiceGrant

export async function GET() {
  try {
    // Test with hardcoded values to isolate the issue
    const accountSid = process.env.TWILIO_ACCOUNT_SID!
    const apiKeySid = process.env.TWILIO_API_KEY_SID!
    const apiKeySecret = process.env.TWILIO_API_KEY_SECRET!
    const twimlAppSid = process.env.TWILIO_TWIML_APP_SID!

    console.log('Testing token generation...')
    console.log('Account SID length:', accountSid.length)
    console.log('API Key SID length:', apiKeySid.length)
    console.log('API Secret length:', apiKeySecret.length)
    console.log('TwiML App SID length:', twimlAppSid.length)

    // Create a simple token
    const identity = 'test-user'
    const token = new AccessToken(
      accountSid,
      apiKeySid,
      apiKeySecret,
      { identity }
    )

    const voiceGrant = new VoiceGrant({
      outgoingApplicationSid: twimlAppSid,
      incomingAllow: true
    })

    token.addGrant(voiceGrant)

    const jwt = token.toJwt()
    
    // Decode the token to see its structure
    const parts = jwt.split('.')
    const header = JSON.parse(Buffer.from(parts[0], 'base64').toString())
    const payload = JSON.parse(Buffer.from(parts[1], 'base64').toString())

    return NextResponse.json({
      token: jwt,
      decoded: {
        header,
        payload: {
          ...payload,
          // Hide sensitive data
          iss: payload.iss?.substring(0, 10) + '...',
          sub: payload.sub?.substring(0, 10) + '...'
        }
      }
    })
  } catch (error: any) {
    console.error('Token test error:', error)
    return NextResponse.json({ 
      error: error.message,
      stack: error.stack 
    }, { status: 500 })
  }
}