import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import Nav from "./components/navigation/nav";
import { Toaster } from "@/components/ui/sooner";
import {Roboto} from "next/font/google";
// import Footer from "@/components/footer"
// If Footer exists at './components/footer', use:
import Footer from "./components/footer";



const roboto = Roboto({
  weight: ["400", "500", "700", "900"],
  subsets: ["latin"],
})

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Debbies cakes and pastries",
  description: "Debbies cakes and pastries",
};
export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${geistSans.variable} bg-amber-50  ${geistMono.variable} antialiased`}
      >
        <Nav />

        {/* Full-width wrapper (no padding) */}
        <div className="w-full">
          {children}
        </div>

        <Toaster />
        <Footer />
      </body>
    </html>
  );
}
