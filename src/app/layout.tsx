import "./globals.css";
import { Inter } from "next/font/google";
import { Providers } from "./Providers";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { Toaster } from "@/components/ui/sonner";

const inter = Inter({ subsets: ["latin"] });

export const metadata = {
  title: "School Management System",
  description: "Modern Next.js school management platform",
};

export default async function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const session = await getServerSession(authOptions);
  return (
    <html lang="en">
      <body className={`${inter.className} bg-gray-50 text-gray-900`}>
        <Providers session={session}>{children}</Providers>
        <Toaster />
      </body>
    </html>
  );
}
