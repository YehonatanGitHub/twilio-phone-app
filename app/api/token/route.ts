import { NextResponse } from 'next/server'
import jwt from 'jsonwebtoken'
import crypto from 'crypto'

export async function GET() {
  try {
    const accountSid = process.env.TWILIO_ACCOUNT_SID!
    const apiKeySid = process.env.TWILIO_API_KEY_SID!
    const apiKeySecret = process.env.TWILIO_API_KEY_SECRET!
    const twimlAppSid = process.env.TWILIO_TWIML_APP_SID!

    // Generate a random identity for the client
    const identity = crypto.randomBytes(16).toString('hex')

    // Create access token
    const now = Math.floor(Date.now() / 1000)
    const payload = {
      jti: `${apiKeySid}-${now}`,
      iss: apiKeySid,
      sub: accountSid,
      exp: now + 3600, // Token expires in 1 hour
      grants: {
        identity: identity,
        voice: {
          outgoing: {
            application_sid: twimlAppSid
          },
          incoming: {
            allow: true
          }
        }
      }
    }

    const token = jwt.sign(payload, apiKeySecret, {
      algorithm: 'HS256',
      header: {
        cty: 'twilio-fpa;v=1',
        typ: 'JWT'
      }
    })

    return NextResponse.json({ 
      token,
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