import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import '@/styles/globals.css'
import { ThemeProvider } from '@/components/theme-provider'
import { CreditProvider } from '@/contexts/credit-context'
import { AuthProvider } from '@/contexts/auth-context'

const inter = Inter({ subsets: ['latin'] })

export const metadata: Metadata = {
  title: 'Brandsnap Home Staging - Home Staging Virtuel par IA',
  description: 'Transformez vos biens immobiliers vides en intérieurs meublés avec l\'IA. Home staging virtuel pour agences immobilières.',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={inter.className}>
        <ThemeProvider
          attribute="class"
          defaultTheme="system"
          enableSystem
          disableTransitionOnChange
        >
          <AuthProvider>
            <CreditProvider>
              {children}
            </CreditProvider>
          </AuthProvider>
        </ThemeProvider>
      </body>
    </html>
  )
}
