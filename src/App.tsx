import { BrowserRouter as Router } from 'react-router-dom'
import AppRoutes from '@/router/routes'
import { Layout } from '@/components/Layout'
import { CommandMenu } from '@/components/CommandMenu'
import { Toaster } from '@/components/ui/sonner'
import { NetworkStatus } from '@/components/NetworkStatus'
import { SessionStatus } from '@/components/auth/SessionStatus'
import { SkipLink } from '@/components/accessibility/SkipLink'
import { ErrorHandlingService } from '@/lib/services/errorHandlingService'
import { SessionManager } from '@/lib/utils/sessionManager'
import { useEffect } from 'react'

// Import API test utility for debugging
import '@/lib/utils/apiTest'

// Import debug logger for comprehensive logging
import { debugLogger } from '@/lib/utils/debugLogger'

// Import test utilities for developer testing
import '@/lib/utils/testUtils'

function App() {
  // Initialize application services
  useEffect(() => {
    const cleanup = ErrorHandlingService.initializeNetworkMonitoring();
    
    // Initialize session management (Requirements 1.3, 1.4)
    SessionManager.initialize();
    
    // Initialize debug logging
    debugLogger.log('Application initialized', {
      component: 'App',
      action: 'app_init',
      metadata: {
        environment: import.meta.env.MODE,
        timestamp: new Date().toISOString()
      }
    });
    
    // Cleanup function
    return () => {
      if (cleanup) cleanup();
      SessionManager.cleanup();
    };
  }, []);

  return (
    <div 
      className="relative min-h-screen light-educational-bg"
      style={{
        backgroundImage: "url('/bg-image.svg')",
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        backgroundRepeat: 'no-repeat',
        backgroundAttachment: 'fixed'
      }}
    >
      <Router>
        {/* Skip Links for Accessibility */}
        <SkipLink href="#main-content">
          Skip to main content
        </SkipLink>
        
        <CommandMenu />
        <Layout>
          <main id="main-content" tabIndex={-1}>
            <AppRoutes />
          </main>
        </Layout>
        <NetworkStatus />
        <SessionStatus />
        <Toaster 
          position="top-right"
          expand={true}
          richColors={true}
          closeButton={true}
        />
      </Router>
    </div>
  )
}

export default App
