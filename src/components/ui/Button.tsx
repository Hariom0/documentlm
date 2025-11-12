import React from 'react'

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
    children : React.ReactNode;
}

export const Button = ({children, ...props }: ButtonProps) => {
  return (
  <button className='px-4 py-2 rounded-md bg-blue-800/90 text-white font-medium hover:bg-indigo-700 transition-colors flex items-center justify-center cursor-pointer' {...props}>
    {children}
  </button>)
}


export default Button;