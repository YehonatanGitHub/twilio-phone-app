'use client'

import { useState } from 'react'
import { useTwilioDevice } from '@/app/hooks/useTwilioDevice'
import { Call } from '@twilio/voice-sdk'

export default function Phone() {
  const [phoneNumber, setPhoneNumber] = useState('')
  const [incomingCallFrom, setIncomingCallFrom] = useState<string | null>(null)
  
  const {
    activeCall,
    isReady,
    isRegistered,
    error,
    makeCall,
    acceptCall,
    rejectCall,
    hangUp,
    toggleMute,
    isMuted,
    callStatus,
  } = useTwilioDevice({
    onIncomingCall: (call) => {
      setIncomingCallFrom(call.parameters.From || 'Unknown')
    },
    onCallEnded: () => {
      setIncomingCallFrom(null)
    },
  })

  const handleCall = async () => {
    if (activeCall) {
      hangUp()
    } else if (phoneNumber) {
      await makeCall(phoneNumber)
    }
  }

  const handleKeyPress = (digit: string) => {
    setPhoneNumber(prev => prev + digit)
    if (activeCall && callStatus === Call.State.Open) {
      activeCall.sendDigits(digit)
    }
  }

  const handleBackspace = () => {
    setPhoneNumber(prev => prev.slice(0, -1))
  }

  const formatPhoneNumber = (number: string) => {
    const cleaned = number.replace(/\D/g, '')
    if (cleaned.length <= 3) return cleaned
    if (cleaned.length <= 6) return `(${cleaned.slice(0, 3)}) ${cleaned.slice(3)}`
    return `(${cleaned.slice(0, 3)}) ${cleaned.slice(3, 6)}-${cleaned.slice(6, 10)}`
  }

  return (
    <div className="max-w-sm mx-auto p-6 bg-white rounded-lg shadow-lg">
      <div className="mb-4">
        <h2 className="text-2xl font-bold text-center mb-2">Twilio Phone</h2>
        
        {/* Status indicators */}
        <div className="flex justify-center gap-4 text-sm mb-4">
          <span className={`px-2 py-1 rounded ${isReady ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}`}>
            {isReady ? 'Ready' : 'Not Ready'}
          </span>
          <span className={`px-2 py-1 rounded ${isRegistered ? 'bg-green-100 text-green-800' : 'bg-yellow-100 text-yellow-800'}`}>
            {isRegistered ? 'Registered' : 'Not Registered'}
          </span>
        </div>

        {error && (
          <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-2 rounded mb-4">
            {error}
          </div>
        )}

        {/* Incoming call notification */}
        {incomingCallFrom && callStatus === Call.State.Pending && (
          <div className="bg-blue-100 border border-blue-400 text-blue-700 px-4 py-3 rounded mb-4">
            <p className="font-semibold">Incoming call from:</p>
            <p>{incomingCallFrom}</p>
            <div className="flex gap-2 mt-2">
              <button
                onClick={acceptCall}
                className="bg-green-500 text-white px-4 py-2 rounded hover:bg-green-600"
              >
                Accept
              </button>
              <button
                onClick={rejectCall}
                className="bg-red-500 text-white px-4 py-2 rounded hover:bg-red-600"
              >
                Reject
              </button>
            </div>
          </div>
        )}

        {/* Phone display */}
        <div className="bg-gray-100 p-4 rounded mb-4">
          <input
            type="tel"
            value={formatPhoneNumber(phoneNumber)}
            onChange={(e) => setPhoneNumber(e.target.value.replace(/\D/g, ''))}
            placeholder="Enter phone number"
            className="w-full text-center text-xl bg-transparent outline-none"
            disabled={!isReady}
          />
          {callStatus && (
            <p className="text-center text-sm text-gray-600 mt-2">
              Status: {callStatus}
            </p>
          )}
        </div>

        {/* Dialpad */}
        <div className="grid grid-cols-3 gap-2 mb-4">
          {['1', '2', '3', '4', '5', '6', '7', '8', '9', '*', '0', '#'].map((digit) => (
            <button
              key={digit}
              onClick={() => handleKeyPress(digit)}
              disabled={!isReady}
              className="p-4 text-lg font-semibold bg-gray-200 rounded hover:bg-gray-300 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {digit}
            </button>
          ))}
        </div>

        {/* Control buttons */}
        <div className="flex gap-2 mb-2">
          <button
            onClick={handleBackspace}
            disabled={!isReady || phoneNumber.length === 0}
            className="flex-1 p-3 bg-gray-200 rounded hover:bg-gray-300 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            ⌫ Delete
          </button>
          <button
            onClick={handleCall}
            disabled={!isReady || (!activeCall && phoneNumber.length === 0)}
            className={`flex-1 p-3 rounded text-white font-semibold disabled:opacity-50 disabled:cursor-not-allowed ${
              activeCall ? 'bg-red-500 hover:bg-red-600' : 'bg-green-500 hover:bg-green-600'
            }`}
          >
            {activeCall ? '📞 Hang Up' : '📞 Call'}
          </button>
        </div>

        {/* Mute button (only visible during active call) */}
        {activeCall && callStatus === Call.State.Open && (
          <button
            onClick={toggleMute}
            className={`w-full p-3 rounded text-white font-semibold ${
              isMuted ? 'bg-yellow-500 hover:bg-yellow-600' : 'bg-gray-500 hover:bg-gray-600'
            }`}
          >
            {isMuted ? '🔇 Unmute' : '🔊 Mute'}
          </button>
        )}
      </div>
    </div>
  )
}