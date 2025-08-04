import { NextRequest, NextResponse } from 'next/server'
import twilio from 'twilio'

const VoiceResponse = twilio.twiml.VoiceResponse

export async function POST(request: NextRequest) {
  console.log('Voice webhook called')
  
  try {
    const formData = await request.formData()
    const to = formData.get('To') as string
    const from = formData.get('From') as string
    const callDirection = formData.get('Direction') as string
    const callSid = formData.get('CallSid') as string
    
    console.log('Voice webhook:', {
      callSid,
      to,
      from,
      direction: callDirection,
      twilioNumber: process.env.TWILIO_PHONE_NUMBER
    })
    
    const twiml = new VoiceResponse()

    // Check if this is an incoming call to your Twilio number
    if (callDirection === 'inbound' || (to === process.env.TWILIO_PHONE_NUMBER && from !== process.env.TWILIO_PHONE_NUMBER)) {
      // Incoming call - route to browser
      console.log('Routing incoming call to browser from:', from)
      const dial = twiml.dial({
        timeout: 30,
        action: '/api/voice-status',
      })
      dial.client('browser-client')
      
      // Add a fallback if no client answers
      twiml.say('Sorry, no one is available to take your call right now. Please try again later.')
    } else if (to) {
      // Outbound call from browser
      const dial = twiml.dial({
        callerId: process.env.TWILIO_PHONE_NUMBER
      })
      
      // Check if calling another client or phone number
      if (to.startsWith('client:')) {
        dial.client(to.substring(7))
      } else {
        dial.number(to)
      }
    } else {
      // Fallback - should not happen
      console.log('Unexpected call parameters')
      twiml.say('Sorry, an error occurred. Please try again.')
    }

    return new NextResponse(twiml.toString(), {
      status: 200,
      headers: {
        'Content-Type': 'text/xml'
      }
    })
  } catch (error) {
    console.error('Error handling voice webhook:', error)
    const twiml = new VoiceResponse()
    twiml.say('An error occurred. Please try again.')
    
    return new NextResponse(twiml.toString(), {
      status: 500,
      headers: {
        'Content-Type': 'text/xml'
      }
    })
  }
}