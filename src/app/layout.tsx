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
  title: "Ігротека професора Орлова О.В. — сапер, соціоніка, «Браво», міністерство і німецька",
  authors: [{ name: "професор Орлов О.В." }],
  description:
    "Ігровий портал українською (і російською): класичний «Сапер», вікторина з соціоніки, бізнес-симулятор торгової мережі «Браво» з зарплатами в гривнях за реальним ринком України, політичний симулятор «Віртуальне міністерство» — кабінети України через соціоніку — та тренажер німецької мови для рівня A1. Прогрес зберігається в браузері. Автор ігор і тренажерів — професор Орлов О.В.",
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
    "німецька мова",
    "німецька A1",
    "тренажер німецької",
    "igroteka",
    "игротека",
    "Орлов",
    "професор Орлов",
    "Орлов О.В.",
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
