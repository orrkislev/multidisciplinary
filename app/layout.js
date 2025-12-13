import localFont from 'next/font/local'
import { Geist_Mono, Geist, Inter, Cedarville_Cursive, Fraunces, Markazi_Text, Caveat } from "next/font/google";

import "@/app/globals.css"

const inter = Inter({
  subsets: ["latin"],
});

const caveat = Caveat({
  subsets: ["latin"],
  weight: "400",
  variable: "--font-caveat",
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

const FrauncesFont = Fraunces({
  subsets: ["latin"],
  weight: "400",
  variable: "--font-fraunces",
});
const FrauncesFontBold = Fraunces({
  subsets: ["latin"],
  weight: "700",
  variable: "--font-fraunces-bold",
});
const MarkaziText = Markazi_Text({
  subsets: ["latin"],
  weight: "400",
  variable: "--font-markazi-text",
});

export const metadata = {
  title: "Serendipity Engine",
  description: "A serendipitous exploration of interdisciplinary topics",
};

export const dynamic = 'force-dynamic'

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body
        className={` 
          ${magilio.variable}
          ${Cylburn.variable}
          ${geistSans.variable} ${geistMono.variable}          
          ${caveat.variable}
          ${inter.className}
          ${FrauncesFont.variable} ${FrauncesFontBold.variable}
          ${MarkaziText.variable}
          ${caveat.variable}
          antialiased`}
      >
        {children}
      </body>
    </html>
  );
}
