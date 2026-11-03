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
  title: "Ігротека — сапер, тренажер, «Браво» і міністерство",
  description:
    "Ігровий портал українською (і російською): класичний «Сапер», вікторина з соціоніки, бізнес-симулятор торгової мережі «Браво» з зарплатами в гривнях за реальним ринком України та політичний симулятор «Віртуальне міністерство» — кабінети України через соціоніку. Прогрес зберігається в браузері.",
  keywords: [
    "ігри",
    "сапер",
    "соціоніка",
    "вікторина",
    "симулятор",
    "мережа магазинів",
    "Браво",
    "бізнес-гра",
    "міністерство",
    "уряд",
    "політика",
    "igroteka",
    "игротека",
  ],
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="uk" suppressHydrationWarning>
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased bg-background text-foreground`}
      >
        {children}
      </body>
    </html>
  );
}
