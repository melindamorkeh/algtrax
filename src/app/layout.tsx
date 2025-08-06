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
import { ClerkProvider } from "@clerk/nextjs";

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
    <ClerkProvider
      appearance={{
        baseTheme: undefined,
        variables: {
          colorPrimary: '#3b82f6',
          colorBackground: 'hsl(var(--background))',
          colorInputBackground: 'hsl(var(--card))',
          colorInputText: 'hsl(var(--foreground))',
          colorText: 'hsl(var(--foreground))',
          colorTextSecondary: 'hsl(var(--muted-foreground))',
          colorBorder: 'hsl(var(--border))',
          borderRadius: '0.5rem',
          fontFamily: 'var(--font-sans)',
          fontSize: '0.875rem',
        },
        elements: {
          card: {
            boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1), 0 2px 4px -2px rgb(0 0 0 / 0.1)',
            borderRadius: '0.75rem',
          },
          formButtonPrimary: {
            backgroundColor: '#3b82f6',
            color: '#ffffff',
            borderRadius: '0.5rem',
            fontSize: '0.875rem',
            padding: '0.5rem 1rem',
            '&:hover': {
              backgroundColor: '#2563eb',
            },
          },
          formButtonSecondary: {
            backgroundColor: 'transparent',
            color: 'hsl(var(--foreground))',
            border: '1px solid hsl(var(--border))',
            borderRadius: '0.5rem',
            fontSize: '0.875rem',
            padding: '0.5rem 1rem',
            '&:hover': {
              backgroundColor: 'hsl(var(--muted))',
            },
          },
          formFieldInput: {
            backgroundColor: 'hsl(var(--card))',
            color: 'hsl(var(--foreground))',
            border: '1px solid hsl(var(--border))',
            borderRadius: '0.375rem',
            fontSize: '0.875rem',
            padding: '0.5rem 0.75rem',
            '&:focus': {
              borderColor: '#3b82f6',
              boxShadow: '0 0 0 1px #3b82f6',
            },
          },
          modalBackdrop: {
            backgroundColor: 'rgba(0, 0, 0, 0.5)',
          },
          modalContent: {
            backgroundColor: 'hsl(var(--card))',
            borderRadius: '0.75rem',
            boxShadow: '0 20px 25px -5px rgb(0 0 0 / 0.1), 0 10px 10px -5px rgb(0 0 0 / 0.04)',
          },
        },
      }}
    >
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
    </ClerkProvider>
  );
}
