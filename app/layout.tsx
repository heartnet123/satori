import type { Metadata } from "next";
import { Manrope, Space_Grotesk } from "next/font/google";
import { Sidebar } from "./_components/sidebar";
import "./globals.css";

const manrope = Manrope({
  variable: "--font-manrope",
  subsets: ["latin"],
});

const spaceGrotesk = Space_Grotesk({
  variable: "--font-space-grotesk",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Satori",
  description: "AI Recruitment & Analysis System",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`${manrope.variable} ${spaceGrotesk.variable} h-full antialiased`}
    >
      <body className="min-h-full bg-background text-foreground">
        <div className="min-h-screen lg:grid lg:grid-cols-[280px_minmax(0,1fr)]">
          <Sidebar />
          <div className="min-w-0">{children}</div>
        </div>
      </body>
    </html>
  );
}
