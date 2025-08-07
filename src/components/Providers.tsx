/**
 * Providers Component
 * 
 * This component wraps the application with all necessary providers:
 * - ClerkProvider for user authentication
 * - ClientThemeProvider for client-side theme management
 * 
 * The providers ensure that authentication state and theme preferences
 * are available throughout the application component tree.
 */

import { ClerkProvider } from "@clerk/nextjs";
import { ClientThemeProvider } from "@/components/ClientThemeProvider";

export function Providers({ children }: { children: React.ReactNode }) {
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
            backgroundColor: 'hsl(var(--card))',
            color: 'hsl(var(--foreground))',
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
            color: 'hsl(var(--foreground))',
          },
          // Additional elements for better dark mode support
          headerTitle: {
            color: 'hsl(var(--foreground))',
          },
          headerSubtitle: {
            color: 'hsl(var(--muted-foreground))',
          },
          socialButtonsBlockButton: {
            color: 'hsl(var(--foreground))',
            border: '1px solid hsl(var(--border))',
            backgroundColor: 'hsl(var(--card))',
            '&:hover': {
              backgroundColor: 'hsl(var(--muted))',
            },
          },
          formFieldLabel: {
            color: 'hsl(var(--foreground))',
          },
          formFieldHintText: {
            color: 'hsl(var(--muted-foreground))',
          },
          formFieldErrorText: {
            color: 'hsl(var(--destructive))',
          },
          footerActionLink: {
            color: '#3b82f6',
            '&:hover': {
              color: '#2563eb',
            },
          },
          footerActionText: {
            color: 'hsl(var(--muted-foreground))',
          },
          identityPreviewText: {
            color: 'hsl(var(--foreground))',
          },
          identityPreviewEditButton: {
            color: '#3b82f6',
            '&:hover': {
              color: '#2563eb',
            },
          },
          // User profile and account management elements
          userButtonBox: {
            color: 'hsl(var(--foreground))',
            backgroundColor: 'hsl(var(--card))',
            border: '1px solid hsl(var(--border))',
            '&:hover': {
              backgroundColor: 'hsl(var(--muted))',
            },
          },
          userButtonTrigger: {
            color: 'hsl(var(--foreground))',
            backgroundColor: 'hsl(var(--card))',
            border: '1px solid hsl(var(--border))',
            '&:hover': {
              backgroundColor: 'hsl(var(--muted))',
            },
          },
          userButtonPopoverCard: {
            backgroundColor: 'hsl(var(--card))',
            color: 'hsl(var(--foreground))',
            border: '1px solid hsl(var(--border))',
            boxShadow: '0 10px 15px -3px rgb(0 0 0 / 0.1), 0 4px 6px -2px rgb(0 0 0 / 0.05)',
          },
          userButtonPopoverActionButton: {
            color: 'hsl(var(--foreground))',
            backgroundColor: 'transparent',
            '&:hover': {
              backgroundColor: 'hsl(var(--muted))',
            },
          },
          userButtonPopoverActionButtonText: {
            color: 'hsl(var(--foreground))',
          },
          userButtonPopoverFooter: {
            color: 'hsl(var(--muted-foreground))',
          },
          userButtonPopoverFooterAction: {
            color: '#3b82f6',
            '&:hover': {
              color: '#2563eb',
            },
          },
          userPreviewMainIdentifier: {
            color: 'hsl(var(--foreground))',
          },
          userPreviewSecondaryIdentifier: {
            color: 'hsl(var(--muted-foreground))',
          },
          userPreviewTextContainer: {
            color: 'hsl(var(--foreground))',
          },
          // Account management specific elements
          accountSwitcherTrigger: {
            color: 'hsl(var(--foreground))',
            backgroundColor: 'hsl(var(--card))',
            border: '1px solid hsl(var(--border))',
            '&:hover': {
              backgroundColor: 'hsl(var(--muted))',
            },
          },
          accountSwitcherPopoverCard: {
            backgroundColor: 'hsl(var(--card))',
            color: 'hsl(var(--foreground))',
            border: '1px solid hsl(var(--border))',
          },
          accountSwitcherPopoverActionButton: {
            color: 'hsl(var(--foreground))',
            backgroundColor: 'transparent',
            '&:hover': {
              backgroundColor: 'hsl(var(--muted))',
            },
          },
          accountSwitcherPopoverActionButtonText: {
            color: 'hsl(var(--foreground))',
          },
        },
      }}
    >
      <ClientThemeProvider>
        {children}
      </ClientThemeProvider>
    </ClerkProvider>
  );
} 