import type { Metadata } from 'next'
import './globals.css'

export const metadata: Metadata = {
  title: 'Pipeline Heroes - Cyberpunk Sales Arena',
  description: 'Enter the neural network of sales performance - where data becomes power',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en" className="dark">
      <body className="font-body">
        <main className="game-background relative">
          <div className="relative z-10">
            {children}
          </div>
        </main>
      </body>
    </html>
  )
}