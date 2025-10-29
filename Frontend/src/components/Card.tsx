import type { ReactNode } from 'react'

export default function Card({ title, children, className = '' }: { title?: ReactNode; children?: ReactNode; className?: string }) {
  return (
    <div className={`rounded-lg border border-gray-200 bg-white shadow-sm ${className}`}>
      {title && (
        <div className="border-b border-gray-200 px-4 py-3">
          <h3 className="text-sm font-semibold text-gray-800">{title}</h3>
        </div>
      )}
      <div className="p-4">{children}</div>
    </div>
  )
}
