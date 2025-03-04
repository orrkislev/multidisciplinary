import localFont from 'next/font/local'
import { Geist_Mono, Geist, Inter } from "next/font/google";

import "@/app/globals.css"

const inter = Inter({
  subsets: ["latin"],
});

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

const magilio = localFont({
  src: '/assets/MagilioRegular.otf',
  display: 'swap',
  variable: '--font-magilio',
})
const Cylburn = localFont({
  src: '/assets/Cylburn.otf',
  display: 'swap',
  variable: '--font-cylburn',
})

export const metadata = {
  title: "Serendipity Engine",
  description: "A serendipitous exploration of interdisciplinary topics",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body
        className={` 
          ${magilio.variable}
          ${Cylburn.variable}
          ${geistSans.variable} ${geistMono.variable}          
          ${inter.className}
          antialiased`}
      >
        {children}
      </body>
    </html>
  );
}
