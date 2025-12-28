import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Tech Superhero - Next Gen Gadgets",
  description: "Experience the future of technology with stunning 3D animations",
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
