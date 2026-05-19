import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "DermaCart AI — Akıllı Cilt Bakım Sepeti",
  description: "Yapay zeka destekli cilt bakım ürünü uyumluluk analizi",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="tr" className="h-full" suppressHydrationWarning>
      <body className={`${inter.className} min-h-full bg-gray-50`} suppressHydrationWarning>
        {children}
      </body>
    </html>
  );
}
