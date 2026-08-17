import type { Metadata, Viewport } from "next";
import { Bricolage_Grotesque, Inter } from "next/font/google";
import "./globals.css";

const bricolage = Bricolage_Grotesque({
  subsets: ["latin"],
  weight: ["500", "600", "700", "800"],
  variable: "--font-bricolage",
  display: "swap",
});

const inter = Inter({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
  variable: "--font-inter",
  display: "swap",
});

export const metadata: Metadata = {
  title: "Clypfetch — paste a link, grab the video",
  description:
    "Fetch and download public TikTok and X (Twitter) videos. No login, free, works on mobile and desktop, saves straight to your device.",
  applicationName: "Clypfetch",
};

export const viewport: Viewport = {
  themeColor: "#14121A",
  width: "device-width",
  initialScale: 1,
};

// Set the saved theme before first paint to avoid a flash (dark is default).
const themeInit = `try{if(localStorage.getItem('clypfetch-theme')==='light'){document.documentElement.setAttribute('data-theme','light')}}catch(e){}`;

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className={`${bricolage.variable} ${inter.variable}`}>
      <head>
        <script dangerouslySetInnerHTML={{ __html: themeInit }} />
      </head>
      <body>{children}</body>
    </html>
  );
}
