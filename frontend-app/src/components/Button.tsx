import React from 'react'
import clsx from 'clsx'

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'outline' | 'danger' | 'ghost' | 'muted'
  size?: 'sm' | 'md'
}

export const Button: React.FC<ButtonProps> = ({
  variant = 'primary',
  size = 'md',
  className,
  ...props
}) => {
  const base = 'rounded px-4 py-2 font-medium transition-colors focus:outline-none focus:ring-2 focus:ring-offset-1'

  const variants = {
    primary: 'bg-primary text-white hover:bg-primary-hover focus:ring-primary',
    secondary: 'bg-gray-200 text-gray-800 hover:bg-gray-300 focus:ring-gray-300',
    outline: 'border border-gray-300 text-gray-800 hover:bg-gray-100 focus:ring-gray-300',
    danger: 'bg-error text-white hover:bg-red-600 focus:ring-error',
    ghost: 'text-gray-700 hover:bg-gray-100 focus:ring-gray-300',
    muted: 'bg-brand-gray text-white hover:bg-gray-400 focus:ring-brand-gray',
  }

  const sizes = {
    sm: 'text-sm px-3 py-1.5',
    md: 'text-base px-4 py-2',
  }

  return (
    <button
      className={clsx(base, variants[variant], sizes[size], className)}
      {...props}
    />
  )
}
