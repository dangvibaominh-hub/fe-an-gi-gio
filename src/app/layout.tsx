import type { Metadata } from "next";
import { Be_Vietnam_Pro } from "next/font/google";

import { Navbar } from "@/components/layout/Navbar";

import "./globals.css";

const beVietnamPro = Be_Vietnam_Pro({
  variable: "--font-be-vietnam-pro",
  subsets: ["latin", "vietnamese"],
  weight: ["400", "500", "600", "700"],
});

export const metadata: Metadata = {
  title: {
    default: "Ăn Gì Giờ?",
    template: "%s | Ăn Gì Giờ?",
  },
  description:
    "Gợi ý công thức nấu ăn phù hợp với những nguyên liệu bạn đang có.",
};

interface RootLayoutProps {
  children: React.ReactNode;
}

export default function RootLayout({ children }: Readonly<RootLayoutProps>) {
  return (
    <html lang="vi" className={beVietnamPro.variable}>
      <body className="flex min-h-screen flex-col antialiased">
        <Navbar />
        <main className="flex flex-1 flex-col pt-20">{children}</main>
      </body>
    </html>
  );
}
