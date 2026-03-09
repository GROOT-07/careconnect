import type { Metadata } from 'next'
import './globals.css'

export const metadata: Metadata = {
  title: 'CareConnect — Compassionate Care Platform',
  description: 'Unifying caregivers, families, and clients with Memory Bloom at its heart.',
  icons: { icon: '/favicon.svg' },
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  )
}
