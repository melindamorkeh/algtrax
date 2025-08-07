import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "../styles/globals.css";
import { Providers } from "@/components/Providers";

/**
 * Root Layout Component
 * 
 * This is the top-level layout that wraps all pages in the application.
 * It provides:
 * - Global font configuration (Inter)
 * - Theme providers for dark/light mode
 * - Authentication providers
 * - Global CSS styles
 * - Metadata for SEO
 * 
 * The layout ensures consistent styling and functionality across all pages.
 */

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Algtrax - Learn, Code, and Visualize Algorithms",
  description: "Interactive platform for learning algorithms through code and visualizations",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className={inter.className}>
        {/* Providers wrapper - includes theme and authentication providers */}
        <Providers>
          {children}
        </Providers>
      </body>
    </html>
  );
}
