import React from 'react'

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
    children : React.ReactNode;
}

export const Button = ({children, ...props }: ButtonProps) => {
  return (
  <button className='px-4 py-2 rounded-md bg-gradient-to-r from-blue-800/90 to-blue-600/80 text-white font-medium hover:bg-blue-900 transition-colors flex items-center justify-center cursor-pointer shadow-md' {...props}>
    {children}
  </button>)
}


export default Button;