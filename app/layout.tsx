import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { cn } from "@/lib/utils";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "En Ucuz Hac Umre",
  description: "Premium Hac ve Umre Seyahat Acentası",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="tr" className="scroll-smooth">
      <body className={cn(inter.className, "antialiased min-h-screen bg-background text-primary")}>
        {children}
      </body>
    </html>
  );
}
