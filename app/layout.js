import localFont from 'next/font/local'
import { Geist_Mono, Geist, Inter, Cedarville_Cursive, Fraunces, Markazi_Text } from "next/font/google";

import "@/app/globals.css"

const inter = Inter({
  subsets: ["latin"],
});

const cedarvilleCursive = Cedarville_Cursive({
  subsets: ["latin"],
  weight: "400",
  variable: "--font-cedarville-cursive",
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

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body
        className={` 
          ${magilio.variable}
          ${Cylburn.variable}
          ${geistSans.variable} ${geistMono.variable}          
          ${cedarvilleCursive.variable}
          ${inter.className}
          ${FrauncesFont.variable} ${FrauncesFontBold.variable}
          ${MarkaziText.variable}
          antialiased`}
      >
        {children}
      </body>
    </html>
  );
}
