import './globals.css'
import Script from 'next/script'

const siteUrl = 'https://pritishdesigns.vercel.app'

export const metadata = {
  metadataBase: new URL(siteUrl),
  title: 'Pritish Patil',
  description: 'Product design, visual communication, design engineering',
  openGraph: {
    title: 'Pritish Patil',
    description: 'Product design, visual communication, design engineering',
    url: siteUrl,
    siteName: 'Pritish Patil',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Pritish Patil',
    description: 'Product design, visual communication, design engineering',
  },
  icons: {
    icon: [{ url: '/images/icon.png', type: 'image/png', sizes: '512x512' }],
    shortcut: '/images/icon.png',
  },
}

export const viewport = {
  viewportFit: 'cover',
}

export default function RootLayout({ children }) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body>
        <Script id="browser-flag" strategy="beforeInteractive">{`
          (function () {
            var ua = navigator.userAgent;
            var safari = /Safari/i.test(ua) && !/Chrome|CriOS|Chromium|FxiOS|EdgiOS|OPiOS|Android/i.test(ua);
            document.documentElement.setAttribute('data-browser', safari ? 'safari' : 'chrome');
            window.addEventListener('error', function (e) {
              var stack = (e.error && e.error.stack) || '';
              var file = e.filename || '';
              var fromCssHmr = stack.indexOf('hotModuleReplacement') !== -1 || file.indexOf('hotModuleReplacement') !== -1;
              if (fromCssHmr && String(e.message || '').indexOf("reading 'removeChild'") !== -1) {
                e.preventDefault();
                e.stopImmediatePropagation();
              }
            }, true);
          })();
        `}</Script>
        {children}
      </body>
    </html>
  )
}
