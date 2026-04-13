import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Aloysius Hon — Full Stack Developer",
  description:
    "Portfolio of Aloysius Hon — Full Stack Developer & CS Student. Built with a block-based engine.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="h-full antialiased">
      <body className="min-h-full bg-gray-950 text-gray-100">{children}</body>
    </html>
  );
}
