import { NextResponse } from 'next/server'

export async function GET() {
  return NextResponse.json({
    hasAccountSid: !!process.env.TWILIO_ACCOUNT_SID,
    hasApiKey: !!process.env.TWILIO_API_KEY_SID,
    hasApiSecret: !!process.env.TWILIO_API_KEY_SECRET,
    hasTwimlApp: !!process.env.TWILIO_TWIML_APP_SID,
    accountSidPrefix: process.env.TWILIO_ACCOUNT_SID?.substring(0, 2),
    apiKeyPrefix: process.env.TWILIO_API_KEY_SID?.substring(0, 2),
    twimlAppPrefix: process.env.TWILIO_TWIML_APP_SID?.substring(0, 2),
  })
}