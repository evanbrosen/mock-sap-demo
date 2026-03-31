import { Link, useLocation } from 'react-router-dom'
import { cn } from '@/lib/utils'

function Layout({ children }: { children: React.ReactNode }) {
  const location = useLocation()

  const isActive = (path: string) => {
    return location.pathname === path
  }

  return (
    <div className="flex flex-col min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-gradient-to-r from-primary to-blue-700 text-white shadow-md">
        <div className="max-w-7xl mx-auto px-6 py-6">
          <h1 className="text-2xl font-bold">Mock SAP S/4HANA Frontend</h1>
          <p className="text-sm opacity-90">Fiori Intent-Based Navigation Demo</p>
        </div>
      </header>

      {/* Navigation */}
      <nav className="bg-white border-b border-border shadow-sm">
        <div className="max-w-7xl mx-auto px-6">
          <div className="flex gap-0">
            <Link
              to="/"
              className={cn(
                "px-6 py-3 font-medium text-sm border-b-2 transition-colors",
                isActive('/') 
                  ? 'border-primary text-primary' 
                  : 'border-transparent text-text-secondary hover:text-gray-900'
              )}
            >
              Home
            </Link>
            <Link
              to="/objects"
              className={cn(
                "px-6 py-3 font-medium text-sm border-b-2 transition-colors",
                isActive('/objects') 
                  ? 'border-primary text-primary' 
                  : 'border-transparent text-text-secondary hover:text-gray-900'
              )}
            >
              Objects
            </Link>
            <Link
              to="/api-docs"
              className={cn(
                "px-6 py-3 font-medium text-sm border-b-2 transition-colors",
                isActive('/api-docs') 
                  ? 'border-primary text-primary' 
                  : 'border-transparent text-text-secondary hover:text-gray-900'
              )}
            >
              API Docs
            </Link>
          </div>
        </div>
      </nav>

      {/* Main Content */}
      <main className="flex-1 bg-gray-50">
        <div className="max-w-7xl mx-auto px-6 py-8">
          {children}
        </div>
      </main>

      {/* Footer */}
      <footer className="bg-white border-t border-border">
        <div className="max-w-7xl mx-auto px-6 py-6 text-center text-sm text-text-secondary">
          <p>&copy; 2026 Mock SAP Frontend. Built with React, TypeScript, and shadcn/ui.</p>
        </div>
      </footer>
    </div>
  )
}

export default Layout
