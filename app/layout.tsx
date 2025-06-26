import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import Navbar from "@/components/Navbar";
import Footer from "@/components/footer";

const geistSans = Inter({
  variable: "--font-Inter",
  subsets: ["latin"],
});

const geistMono = Inter({
  variable: "--font-Inter",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "PostPulse - Your Personal LinkedIn Growth Assistant",
  description: "PostPulse is your AI-powered assistant for crafting engaging LinkedIn posts that resonate with your audience. Effortlessly generate, refine, and optimize your content to boost engagement and grow your professional network.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        <Navbar />
        <main>{children}</main>
        <Footer />
      </body>
    </html>
  );
}
