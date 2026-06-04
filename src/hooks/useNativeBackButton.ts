import { useEffect, useRef } from 'react'
import { App } from '@capacitor/app'
import { Capacitor } from '@capacitor/core'

type Handler = () => void
const handlerStack: Handler[] = []
let listenerRegistered = false

function ensureListener() {
  if (listenerRegistered) return
  listenerRegistered = true
  console.log(`[NAV] Native back button listener registered`)
  App.addListener('backButton', () => {
    const top = handlerStack[handlerStack.length - 1]
    if (top) top()
  })
}

export function useNativeBackButton(handler: Handler): void {
  const handlerRef = useRef<Handler>(handler)
  handlerRef.current = handler

  useEffect(() => {
    if (!Capacitor.isNativePlatform()) return
    ensureListener()
    const wrapper = () => handlerRef.current()
    handlerStack.push(wrapper)
    console.log(`[NAV] Back button handler pushed, stack depth: ${handlerStack.length}`)
    return () => {
      const idx = handlerStack.lastIndexOf(wrapper)
      if (idx !== -1) handlerStack.splice(idx, 1)
    }
  }, [])
}
