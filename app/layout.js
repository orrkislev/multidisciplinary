import { Grenze, Figtree, Martian_Mono, Caveat } from "next/font/google";

import "@/app/globals.css"
import DesktopGate from "@/app/(__components)/DesktopGate"

const grenze = Grenze({
  subsets: ["latin"],
  weight: ["400", "600"],
  style: ["normal", "italic"],
  variable: "--font-grenze",
});

const figtree = Figtree({
  subsets: ["latin"],
  variable: "--font-figtree",
});

const martian = Martian_Mono({
  subsets: ["latin"],
  variable: "--font-martian",
});

const caveat = Caveat({
  subsets: ["latin"],
  variable: "--font-caveat",
});

export const metadata = {
  title: "Serendipity Engine",
  description: "A serendipitous exploration of interdisciplinary topics",
};

export const dynamic = 'force-dynamic'

export default function RootLayout({ children }) {
  return (
    <html lang="en" className={`${grenze.variable} ${figtree.variable} ${martian.variable} ${caveat.variable}`}>
      <body className="antialiased">
        <DesktopGate>{children}</DesktopGate>
      </body>
    </html>
  );
}
