import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import './globals.css'

const inter = Inter({ subsets: ['latin'] })

export const metadata: Metadata = {
  title: 'Pipeline Heroes - Sales Gamification Platform',
  description: 'Turn your sales KPIs into an epic RPG adventure',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en" className="dark">
      <body className={inter.className}>
        <main className="game-background">
          {children}
        </main>
      </body>
    </html>
  )
}