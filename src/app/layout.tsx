import type { Metadata } from "next";
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

export const metadata: Metadata = {
  title: "Игротека — сапёр, соционический тренажёр и «Браво»",
  description:
    "Личный игровой портал: классический «Сапёр», викторина по соционике и бизнес-симулятор торговой сети «Браво» с зарплатами в гривнах по реальному рынку Украины. Прогресс хранится в браузере.",
  keywords: [
    "игры",
    "сапёр",
    "соционика",
    "викторина",
    "симулятор",
    "сеть магазинов",
    "Браво",
    "бизнес-игра",
  ],
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="ru" suppressHydrationWarning>
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased bg-background text-foreground`}
      >
        {children}
      </body>
    </html>
  );
}
