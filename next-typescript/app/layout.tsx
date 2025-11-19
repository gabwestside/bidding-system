import { Header } from '@/components/header'
import type { Metadata } from 'next'
import type { ReactNode } from 'react'
import './globals.css'

export const metadata: Metadata = {
  title: 'Aspec SLE - Portal de Licitações',
  description: 'Plataforma de licitações integrada aos produtos Aspec.',
}

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang='pt-BR'>
      <body className='min-h-screen bg-bg font-sans text-slate-900'>
        <Header />
        <main className='max-w-6xl mx-auto px-4 py-8'>{children}</main>
      </body>
    </html>
  )
}
