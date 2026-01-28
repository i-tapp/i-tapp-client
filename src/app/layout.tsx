import React from "react";
import type { Metadata } from "next";
import { Montserrat, Open_Sans } from "next/font/google";
import "./globals.css";
import "react-toastify/dist/ReactToastify.css";
import { Analytics } from "@vercel/analytics/next";
import { AppProvider } from "@/components/providers/app-provider";
import { ReactQueryProvider } from "@/provider/react-query-provider";
import { ToastContainer } from "react-toastify";
import { app } from "@/config/app";
import Script from "next/script";

export const montserrat = Montserrat({
  weight: ["400", "500", "600", "700"],
  subsets: ["latin"],
  variable: "--font-montserrat",
  display: "swap",
});

export const opensans = Open_Sans({
  weight: ["400", "500", "600", "700"],
  subsets: ["latin"],
  variable: "--font-opensans",
  display: "swap",
});
const siteUrl = "https://i-tapp.com";

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  title: {
    default: app.title,
    template: `%s | ${app.name}`,
  },
  description: app.description,
  icons: {
    icon: app.favicon_url,
    apple: [{ url: "/apple-touch-icon.png" }],
  },
  alternates: {
    canonical: "/",
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
    },
  },

  openGraph: {
    siteName: app.name,
    title: app.title,
    description: app.description,
    type: "website",
    locale: "en_NG",
    images: [
      "/placeholder.jpg", // if you have an absolute URL, even better
    ],
  },

  twitter: {
    card: "summary_large_image",
    title: app.title,
    description: app.description,
    images: ["/placeholder.jpg"],
  },

  other: {
    keywords: ["I-TAPP", "ITAPP", "SIWES", "IT Placement", "Nigeria"],
    author: "I-TAPP",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <head>
        <Script
          id="website-structured-data"
          type="application/ld+json"
          strategy="beforeInteractive"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              "@context": "https://schema.org",
              "@type": "WebSite",
              name: "i-Tapp",
              alternateName: "I-Tapp",
              url: siteUrl,
            }),
          }}
        />
      </head>
      <body
        className={`${opensans.variable} ${montserrat.variable} antialiased`}
      >
        <ReactQueryProvider>
          <AppProvider>{children}</AppProvider>
        </ReactQueryProvider>
        <ToastContainer
          position="top-center"
          autoClose={3000}
          hideProgressBar
        />
        <Analytics />
      </body>
    </html>
  );
}
