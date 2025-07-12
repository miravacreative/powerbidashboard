import type { Metadata } from 'next'
import './globals.css'

export const metadata: Metadata = {
  title: 'JNE Dashboard Shipment',
  description: 'Performance Shipment JNE Cirebon',
  generator: 'Created By Ferrydn',
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  )
}
