import { Outlet } from 'react-router-dom'
import { useStore } from '../store/store'
import { Header } from '../components/common/Header'
import { Footer } from '../components/common/Footer'
import { AccessibilityMenu } from '../components/common/AccessibilityMenu'

export const AppLayout = () => {
  const isResultsMode = useStore((state) => state.isResultsMode)

  return (
    <div className="min-h-screen flex flex-col selection:bg-blue-100 max-w-full">
      <a
        href="#main-content"
        className="sr-only focus:not-sr-only focus:absolute focus:top-4 focus:right-4 focus:z-[200] bg-blue-600 text-white px-4 py-2 rounded-lg font-bold"
      >
        דלג לתוכן המרכזי
      </a>

      {!isResultsMode && <Header />}

      <div id="app-content" className="flex-1 flex flex-col">
        <main id="main-content" className="flex-1" tabIndex={-1}>
          <Outlet />
        </main>

        {!isResultsMode && <Footer />}
      </div>

      <AccessibilityMenu />
    </div>
  )
}
