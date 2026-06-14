import { useState } from 'react'
import { useStore } from '../store/store'
import { tapState } from '../utils/debugTap'

export function useDebugTap() {
  const [showViewer, setShowViewer] = useState(false)
  const loggedinUser = useStore((state) => state.loggedinUser)

  // Returns true when the 7th tap was reached and the viewer was opened.
  const handleTap = (): boolean => {
    tapState.count += 1
    if (tapState.timer) clearTimeout(tapState.timer)
    tapState.timer = setTimeout(() => { tapState.count = 0 }, 3000)

    if (tapState.count >= 7) {
      tapState.count = 0
      clearTimeout(tapState.timer!)
      tapState.timer = null
      if (loggedinUser?.permissions?.includes('logs:view')) {
        setShowViewer(true)
        return true
      }
    }
    return false
  }

  return {
    handleTap,
    showViewer,
    closeViewer: () => setShowViewer(false),
  }
}
