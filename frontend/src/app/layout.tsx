import type { Metadata } from "next";
import { Plus_Jakarta_Sans } from "next/font/google";
import { ThemeProvider } from "../context/ThemeContext";
import { ToastProvider } from "../context/ToastContext";
import GoogleAuthProvider from "./providers/GoogleAuthProvider";
import "./globals.css";

const plusJakartaSans = Plus_Jakarta_Sans({
  variable: "--font-plus-jakarta-sans",
  subsets: ["latin"],
  weight: ["400", "500", "600", "700", "800"],
});

export const metadata: Metadata = {
  metadataBase: new URL('https://tourhelpdesk.com'),
  title: "Tour Helpdesk - Flights, Hotels & Holiday Bookings",
  description: "Book cheap domestic & international flights, luxury hotels, and intercity buses with 24/7 AI travel support and exclusive offline discounts.",
  keywords: ["flight booking", "cheap flights", "hotels", "bus tickets", "tour helpdesk", "travel deals", "vacation packages"],
  authors: [{ name: "Tour Helpdesk" }],
  openGraph: {
    title: "Tour Helpdesk - Instant Flights & Hotel Deals",
    description: "Compare live fares across 500+ airlines. Fast, secure online booking with 24/7 AI concierge.",
    url: "https://tourhelpdesk.com",
    siteName: "Tour Helpdesk",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Tour Helpdesk - Flights & Hotel Deals",
    description: "Book cheap flights and stays with instant 24/7 AI assistance.",
  },
  icons: {
    icon: [
      { url: '/favicon.ico' },
      { url: '/favicon.png', type: 'image/png' },
    ],
    shortcut: '/favicon.ico',
    apple: '/favicon.png',
  },
};


export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`${plusJakartaSans.variable} ${plusJakartaSans.className} h-full antialiased`}
    >
      <head>
        <link
          rel="stylesheet"
          href="https://fonts.googleapis.com/css2?family=Material+Symbols+Outlined:opsz,wght,FILL,GRAD@20..48,100..700,0..1,-50..200"
        />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              "@context": "https://schema.org",
              "@type": "TravelAgency",
              "name": "Tour Helpdesk",
              "url": "https://tourhelpdesk.com",
              "description": "Enterprise travel booking engine for flights, hotels, and buses with 24/7 AI travel concierge.",
              "currenciesAccepted": "INR, USD, EUR, GBP, AED, CAD",
              "paymentAccepted": "Credit Card, Debit Card, Net Banking, UPI",
              "priceRange": "$$"
            })
          }}
        />
      </head>
      <body className={`${plusJakartaSans.className} min-h-full flex flex-col`}>
        <GoogleAuthProvider>
          <ThemeProvider>
            <ToastProvider>
              {children}
            </ToastProvider>
          </ThemeProvider>
        </GoogleAuthProvider>
      </body>
    </html>
  );
}
