import type { Metadata } from "next";
import { Geist, Geist_Mono, Libre_Baskerville, Poppins, Open_Sans } from "next/font/google";
import { Toaster } from "sonner";
import { CURRENT_PLAN_YEAR } from "@/lib/constants";
import { MetaPixel } from "@/components/analytics/meta-pixel";
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

const poppins = Poppins({
  variable: "--font-poppins",
  subsets: ["latin"],
  weight: ["300", "400", "500", "600", "700"],
});

const openSans = Open_Sans({
  variable: "--font-open-sans",
  subsets: ["latin"],
  weight: ["400", "600", "700"],
});

export const metadata: Metadata = {
  title: `MyPlanForSuccess - Your ${CURRENT_PLAN_YEAR} Real Estate Business Plan`,
  description: "Build your annual business plan with goal-setting, income planning, and accountability tracking for real estate agents.",
};

// The pixel loads on the production site only, never on previews or locally.
const metaPixelId =
  process.env.VERCEL_ENV === "production" && /^\d+$/.test(process.env.NEXT_PUBLIC_META_PIXEL_ID ?? "")
    ? process.env.NEXT_PUBLIC_META_PIXEL_ID
    : undefined;

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${geistSans.variable} ${geistMono.variable} ${libreBaskerville.variable} ${poppins.variable} ${openSans.variable} antialiased`}
      >
        {children}
        <Toaster position="bottom-center" richColors closeButton />
        {metaPixelId && <MetaPixel pixelId={metaPixelId} />}
      </body>
    </html>
  );
}
