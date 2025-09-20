import './global.css'
import type { Metadata } from 'next'
import { GeistSans } from 'geist/font/sans'
import { GeistMono } from 'geist/font/mono'
import { Navbar } from './components/nav'
import Footer from './components/footer'
import { baseUrl } from './sitemap'

export const metadata: Metadata = {
  metadataBase: new URL(baseUrl),
  title: {
    default: 'Ved Gupta Portfolio',
    template: '%s | Ved Gupta Portfolio',
  },
  description: 'This is my portfolio.',
  openGraph: {
    title: 'Ved Gupta Portfolio',
    description: 'This is my portfolio.',
    url: baseUrl,
    siteName: 'Ved Gupta Portfolio',
    locale: 'en_US',
    type: 'website',
    images: [
      {
        url: `${baseUrl}/static/images/innovatorved-banner-2.png`,
        width: 1200,
        height: 630,
        alt: 'Ved Gupta',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Ved Gupta Portfolio',
    description: 'This is my portfolio.',
    creator: '@innovatorved',
    images: [`${baseUrl}/static/images/innovatorved-banner-2.png`],
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },
  icons: {
    icon: '/static/favicons/favicon.ico',
    shortcut: '/static/favicons/favicon.ico',
    apple: '/static/favicons/apple-touch-icon.png',
    other: [
      {
        rel: 'icon',
        type: 'image/png',
        sizes: '32x32',
        url: '/static/favicons/favicon-32x32.png',
      },
      {
        rel: 'icon',
        type: 'image/png',
        sizes: '16x16',
        url: '/static/favicons/favicon-16x16.png',
      },
      {
        rel: 'android-chrome',
        type: 'image/png',
        sizes: '192x192',
        url: '/static/favicons/android-chrome-192x192.png',
      },
      {
        rel: 'android-chrome',
        type: 'image/png',
        sizes: '512x512',
        url: '/static/favicons/android-chrome-512x512.png',
      },
      {
        rel: 'mask-icon',
        url: '/static/favicons/safari-pinned-tab.svg',
        color: '#5bbad5',
      },
    ],
  },
  manifest: '/static/favicons/site.webmanifest',
}

const cx = (...classes: string[]) => classes.filter(Boolean).join(' ')

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html
      lang="en"
      className={cx(
        'text-black bg-white dark:text-white dark:bg-black',
        GeistSans.variable,
        GeistMono.variable
      )}
    >
      <head />
      <body className="antialiased max-w-xl mx-4 mt-8 lg:mx-auto">
        <main className="flex-auto min-w-0 mt-6 flex flex-col px-2 md:px-0">
          <Navbar />
          {children}
          <Footer />
        </main>
      </body>
    </html>
  )
}
