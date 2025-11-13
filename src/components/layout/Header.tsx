import React from 'react'
import { ArrowLeft, Sparkles } from '@/components/lib/icons'
import Link from "next/link"
import { Button } from '../ui/Button'

type HeaderProps = {
  title: string
  showBackButton?: boolean
  showDashboardButton?: boolean
}

const Header: React.FC<HeaderProps> = ({
  title,
  showBackButton = false,
  showDashboardButton = false,
}) => {
  return (
    <nav className="sticky top-0 z-50 bg-white shadow-lg">
      <div className="max-w-7xl mx-auto max-sm:px-6">
        <div className="flex justify-between items-center h-16">
          {/* Left side */}
          <div className="flex items-center space-x-2">
            <div className="w-10 h-10 rounded-lg flex items-center justify-center bg-gradient-to-br from-blue-900/90 to-blue-600/90 m-2">
              <Sparkles className="w-5 h-5 text-white" />
            </div>
            <span className="text-xl font-bold text-stone-800">{title}</span>
          </div>

          {/* Right side */}
          <div className="flex items-center space-x-4">
            {showBackButton && (
              <Link href="/">
                <Button>
                  <ArrowLeft className="w-4 h-4 mr-2 " />
                  Back to Home
                </Button>
              </Link>
            )}
            
            {showDashboardButton && (
              <Link href="/dashboard">
                <Button>
                  View Dashboard
                </Button>
              </Link>
            )}
          </div>
        </div>
      </div>
    </nav>
  )
}

export default Header

