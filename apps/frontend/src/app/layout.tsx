import type { Metadata } from 'next'
import AntdProvider from './AntdProvider'
import GlassShell from './GlassShell'
import './globals.css'

export const metadata: Metadata = {
  title: 'HandLend — Conditional Humanitarian Financing',
  description: 'Funds locked in escrow, field evidence captured, AI-validated, settled on Avalanche.',
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body>
        <AntdProvider>
          <GlassShell>
            {children}
          </GlassShell>
        </AntdProvider>
      </body>
    </html>
  )
}
