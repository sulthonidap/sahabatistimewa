import type { Metadata, Viewport } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { ToastProvider } from '@/components/ui/toast-provider';

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
});

export const metadata: Metadata = {
  title: "Anak Hebat - Platform Perkembangan Anak",
  description: "Platform edukasi terpadu untuk mendukung perkembangan anak dengan kolaborasi orang tua, terapis, dan psikolog.",
  keywords: "perkembangan anak, terapi, psikolog, edukasi, platform",
  authors: [{ name: "Anak Hebat Team" }],
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="id">
      <body
        className={`${inter.variable} antialiased`}
      >
        <ToastProvider>
          {children}
        </ToastProvider>
      </body>
    </html>
  );
}
