import type { Metadata } from "next";
import "./globals.css";
import { ChatWidget } from "@/components/ChatWidget";

export const metadata: Metadata = {
  title: "Founder Revenue Co-Pilot",
  description:
    "Developer-first revenue infrastructure. Calm, confident, quietly powerful.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className="min-h-screen antialiased">
        {children}
        <ChatWidget />
      </body>
    </html>
  );
}
