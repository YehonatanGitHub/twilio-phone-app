'use client'

import { useState, useEffect, useCallback } from 'react'
import { Device, Call } from '@twilio/voice-sdk'

export interface UseDeviceOptions {
  onIncomingCall?: (call: Call) => void
  onCallEnded?: () => void
}

export function useTwilioDevice(options: UseDeviceOptions = {}) {
  const [device, setDevice] = useState<Device | null>(null)
  const [activeCall, setActiveCall] = useState<Call | null>(null)
  const [isReady, setIsReady] = useState(false)
  const [isRegistered, setIsRegistered] = useState(false)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    let mounted = true

    async function initializeDevice() {
      try {
        const response = await fetch('/api/token')
        const { token } = await response.json()

        if (!mounted) return

        const newDevice = new Device(token, {
          codecPreferences: [Call.Codec.Opus, Call.Codec.PCMU],
          enableRingingState: true,
        })

        // Set up event handlers
        newDevice.on('ready', () => {
          console.log('Device is ready!')
          if (mounted) {
            setIsReady(true)
            setError(null)
          }
        })

        newDevice.on('registered', () => {
          console.log('Device registered successfully!')
          if (mounted) setIsRegistered(true)
        })

        newDevice.on('unregistered', () => {
          console.log('Device unregistered')
          if (mounted) setIsRegistered(false)
        })

        newDevice.on('error', (error) => {
          console.error('Device error:', error)
          if (mounted) setError(error.message)
        })
        
        newDevice.on('registering', () => {
          console.log('Device is registering...')
        })

        newDevice.on('incoming', (call: Call) => {
          console.log('Incoming call from', call.parameters.From)
          if (mounted) {
            setActiveCall(call)
            options.onIncomingCall?.(call)
          }

          call.on('accept', () => {
            console.log('Call accepted')
          })

          call.on('disconnect', () => {
            console.log('Call ended')
            if (mounted) {
              setActiveCall(null)
              options.onCallEnded?.()
            }
          })

          call.on('cancel', () => {
            console.log('Call cancelled')
            if (mounted) {
              setActiveCall(null)
              options.onCallEnded?.()
            }
          })
        })

        await newDevice.register()
        
        if (mounted) {
          setDevice(newDevice)
          
          // The device is registered but not ready due to AudioContext autoplay policy
          // It will become ready after first user interaction
          console.log('Device initialized and registered. Click anywhere to activate audio.')
        }
      } catch (err) {
        console.error('Failed to initialize device:', err)
        if (mounted) {
          setError(err instanceof Error ? err.message : 'Failed to initialize device')
        }
      }
    }

    initializeDevice()

    return () => {
      mounted = false
      if (device) {
        device.disconnectAll()
        device.destroy()
      }
    }
  }, []) // eslint-disable-line react-hooks/exhaustive-deps

  const makeCall = useCallback(async (to: string) => {
    if (!device) {
      setError('Device not initialized')
      return
    }

    try {
      const call = await device.connect({ 
        params: { To: to }
      })

      setActiveCall(call)

      call.on('accept', () => {
        console.log('Outgoing call accepted')
      })

      call.on('disconnect', () => {
        console.log('Outgoing call ended')
        setActiveCall(null)
        options.onCallEnded?.()
      })

      call.on('cancel', () => {
        console.log('Outgoing call cancelled')
        setActiveCall(null)
        options.onCallEnded?.()
      })

      return call
    } catch (err) {
      console.error('Failed to make call:', err)
      setError(err instanceof Error ? err.message : 'Failed to make call')
    }
  }, [device, options])

  const acceptCall = useCallback(() => {
    if (activeCall && activeCall.status() === Call.State.Pending) {
      activeCall.accept()
    }
  }, [activeCall])

  const rejectCall = useCallback(() => {
    if (activeCall && activeCall.status() === Call.State.Pending) {
      activeCall.reject()
      setActiveCall(null)
    }
  }, [activeCall])

  const hangUp = useCallback(() => {
    if (activeCall) {
      activeCall.disconnect()
      setActiveCall(null)
    }
  }, [activeCall])

  const toggleMute = useCallback(() => {
    if (activeCall) {
      const isMuted = activeCall.isMuted()
      activeCall.mute(!isMuted)
      return !isMuted
    }
    return false
  }, [activeCall])

  return {
    device,
    activeCall,
    isReady,
    isRegistered,
    error,
    makeCall,
    acceptCall,
    rejectCall,
    hangUp,
    toggleMute,
    isMuted: activeCall?.isMuted() || false,
    callStatus: activeCall?.status() || null,
  }
}