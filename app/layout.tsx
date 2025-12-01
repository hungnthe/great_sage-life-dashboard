import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { Cinzel_Decorative } from "next/font/google";

const cinzel = Cinzel_Decorative({
  subsets: ["latin"],
  weight: ["700", "900"] // Chọn độ đậm cao nhất
});

export const metadata: Metadata = {
  title: "Great Sage System",
  description: "Life Management Dashboard",
};

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});



export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      {/* 3. Thêm biến font vào body để dùng được ở mọi nơi (hoặc chỉ cần dùng tên biến) */}
      <body className={cinzel.className}> 
        {children}
      </body>
    </html>
  );
}