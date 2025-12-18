import type { Metadata } from "next";
import { Geist, Geist_Mono, Libre_Baskerville } from "next/font/google";
import { Toaster } from "sonner";
import { CURRENT_PLAN_YEAR } from "@/lib/constants";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

const libreBaskerville = Libre_Baskerville({
  variable: "--font-serif",
  subsets: ["latin"],
  weight: ["400", "700"],
  style: ["normal", "italic"],
});

export const metadata: Metadata = {
  title: `MyPlanForSuccess - Your ${CURRENT_PLAN_YEAR} Real Estate Business Plan`,
  description: "Build your annual business plan with goal-setting, income planning, and accountability tracking for real estate agents.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${geistSans.variable} ${geistMono.variable} ${libreBaskerville.variable} antialiased`}
      >
        {children}
        <Toaster position="bottom-center" richColors closeButton />
      </body>
    </html>
  );
}
