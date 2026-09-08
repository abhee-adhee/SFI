import type { Metadata } from "next";
import { Inter, Oswald, Space_Mono } from "next/font/google";
import { NarrativeProvider } from "@/context/NarrativeContext";
import "./globals.css";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-sans",
});

const oswald = Oswald({
  subsets: ["latin"],
  variable: "--font-display",
});

const spaceMono = Space_Mono({
  weight: ["400", "700"],
  subsets: ["latin"],
  variable: "--font-mono",
});

export const metadata: Metadata = {
  title: "NEXUS Dynamics | Advancing Intelligence",
  description: "NEXUS Dynamics is a highly advanced technology company specializing in artificial intelligence, autonomous systems, computational research, and intelligent infrastructure.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={`${inter.variable} ${oswald.variable} ${spaceMono.variable}`}>
      <body className="antialiased">
        <NarrativeProvider>
          {children}
        </NarrativeProvider>
      </body>
    </html>
  );
}
