import type { Metadata } from "next";
import { Inter } from "next/font/google";
import Navbar from "@/components/Navbar";
import "./globals.css";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
});

export const metadata: Metadata = {
  title: "Campaign Tracker",
  description:
    "Track, analyze, and optimize your marketing campaigns in one place.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={inter.variable}>
      <body className="bg-gray-950 font-sans text-white antialiased">
        <Navbar />
        <main>{children}</main>
      </body>
    </html>
  );
}
