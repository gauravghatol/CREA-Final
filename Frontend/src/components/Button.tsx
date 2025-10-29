import type { ButtonHTMLAttributes } from 'react'

type Props = ButtonHTMLAttributes<HTMLButtonElement> & {
  variant?: 'primary' | 'secondary' | 'ghost' | 'danger'
}

export default function Button({ variant = 'primary', className = '', ...rest }: Props) {
  const base = 'inline-flex items-center justify-center rounded-md px-4 py-2 text-sm font-medium focus:outline-none focus:ring-2 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed'
  const variants: Record<string, string> = {
    primary: 'bg-blue-900 text-white hover:bg-blue-800 focus:ring-blue-900',
    secondary: 'bg-amber-500 text-white hover:bg-amber-600 focus:ring-amber-500',
    ghost: 'bg-transparent text-blue-900 hover:bg-blue-50 focus:ring-blue-900',
  danger: 'bg-red-600 text-white hover:bg-red-700 focus:ring-red-600',
  }
  return <button className={`${base} ${variants[variant]} ${className}`} {...rest} />
}
