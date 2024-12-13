import localFont from 'next/font/local'
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

const magilio = localFont({
  src: 'assets/MagilioRegular.otf',
  display: 'swap',
  variable: '--font-magilio',
})
const Cylburn = localFont({
  src: 'assets/Cylburn.otf',
  display: 'swap',
  variable: '--font-cylburn',
})

export const metadata = {
  title: "Multidisplinary Fusion",
  description: "Multidisplinary Fusion",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body
        className={`${geistSans.variable} ${geistMono.variable} ${magilio.variable} ${Cylburn.variable} antialiased`}
      >
        {children}
      </body>
    </html>
  );
}
