import { NextRequest, NextResponse } from 'next/server'
import twilio from 'twilio'

const VoiceResponse = twilio.twiml.VoiceResponse

export async function POST(request: NextRequest) {
  try {
    const formData = await request.formData()
    const to = formData.get('To') as string
    const from = formData.get('From') as string
    
    const twiml = new VoiceResponse()

    if (to) {
      // Outbound call
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
      // Inbound call
      twiml.dial().client('browser-client')
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