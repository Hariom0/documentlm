import React from 'react'
import {Sparkles} from '@/components/lib/icons'
const Footer = () => {
  return (
    <footer className="border-t border-stone-400 py-12 md:py-6 px-4 sm:px-6 lg:px-8 bg-white">
        <div className="max-w-7xl mx-auto">
          <div className="flex flex-col md:flex-row justify-between items-center">
            <div className="flex items-center space-x-2 mb-4 md:mb-0">
              <div className="w-10 h-10 rounded-lg flex items-center justify-center bg-gradient-to-br from-blue-900/90 to-blue-600/90 m-2">
                <Sparkles className="w-5 h-5 text-white " />
              </div>
              <span className="text-xl font-bold text-stone-700">DocumentLM</span>
            </div>
            <p className="text-stone-600 text-center md:text-right">
              &copy; 2025 DocumentLM. Empowering learners with AI technology.
            </p>
          </div>
        </div>
      </footer>
  )
}

export default Footer;