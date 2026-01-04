import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "The Noble Presents",
  description: "Experience the unique style of gifting",
  icons: {
    icon: '/favicon-32x32.png',
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className="antialiased">
        {children}
      </body>
    </html>
  );
}
