import React from 'react'
import {ArrowRight, Sparkles} from '@/components/lib/icons'
import Link from "next/link"
import {Button} from '../ui/Button'

const Header = () => {
  return (
    <nav className="sticky top-0 z-50 bg-white shadow-lg">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-2">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center space-x-2">
              <div className="w-10 h-10 rounded-lg flex items-center justify-center bg-blue-800 m-2">
                <Sparkles className="w-5 h-5 text-white " />
              </div>
              <span className="text-xl font-bold text-stone-800">DocumentLM</span>
            </div>
            <div className="flex items-center space-x-4">
              <Link href="/dashboard">
                <Button >
                  View Dashboard
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </nav>
)
}

export default Header