/* contains:
  - header contains the navigation bar
  - main content contains the page content
  - footer contains the footer
  - sidebar contains the sidebar
  - modal contains the modal
  - toast contains the toast
  - dropdown contains the dropdown
*/

import type { Metadata } from "next";
import { Inter, JetBrains_Mono } from "next/font/google";
import "../styles/globals.css";
import { Providers } from "@/components/Providers";
import { ThemeProvider } from "@/components/ThemeProvider";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-sans",
});

const jetbrainsMono = JetBrains_Mono({
  subsets: ["latin"],
  variable: "--font-mono",
});

const metadata: Metadata = {
  title: "Algorithm Visualiser",
  description: "Visualise algorithms in real-time",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={`${inter.variable} ${jetbrainsMono.variable}`}>
      <head>
        <meta charSet="UTF-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1.0" />
      </head>
      
      <body>
        <Providers>
          <ThemeProvider>
            {/* Main Content */}
            <main>
              {children}
            </main>
          </ThemeProvider>
        </Providers>
      </body>
    </html>
  );
}
