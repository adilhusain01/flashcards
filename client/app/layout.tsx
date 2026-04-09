import type { Metadata } from "next";
import { DM_Serif_Display, DM_Sans } from "next/font/google";
import "./globals.css";

const dmSerif = DM_Serif_Display({
  variable: "--font-serif",
  subsets: ["latin"],
  weight: "400",
});

const dmSans = DM_Sans({
  variable: "--font-sans",
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
});

const siteUrl = process.env.NEXT_PUBLIC_SITE_URL;

export const metadata: Metadata = {
  metadataBase: siteUrl ? new URL(siteUrl) : undefined,
  title: "Flashcards",
  description: "Upload your CSV study data and transform it into an interactive mastery tool.",
  openGraph: {
    title: "Flashcards",
    description:
      "Upload your CSV study data and transform it into an interactive mastery tool.",
    type: "website",
    url: "/",
    images: [
      {
        url: "/og.webp",
        width: 1200,
        height: 630,
        alt: "Flashcards app preview",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Flashcards",
    description:
      "Upload your CSV study data and transform it into an interactive mastery tool.",
    images: ["/og.webp"],
  },
  icons: {
    icon: [{ url: "/favicon.svg", type: "image/svg+xml" }],
    shortcut: [{ url: "/favicon.svg", type: "image/svg+xml" }],
    apple: [{ url: "/favicon.svg", type: "image/svg+xml" }],
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={`${dmSerif.variable} ${dmSans.variable} antialiased`}>
        {children}
      </body>
    </html>
  );
}
