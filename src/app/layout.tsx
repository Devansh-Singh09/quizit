import { cn } from "@/lib/utils";
import "./globals.css";
import type { Metadata } from "next";
import { Inter } from "next/font/google";
import Providers from "@/components/providers";
import Navbar from "@/components/navbar";
import { Toaster } from "@/components/ui/toaster";


const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Quizit",
  description: "Quiz yourself on anything!",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className={cn(inter.className, "antialiased min-h-screen")}>
        <Providers>
          <Navbar />
          <main className="pt-16">
          {children}
          <Toaster />
         </main>
        </Providers>
      </body>
    </html>
  );
}