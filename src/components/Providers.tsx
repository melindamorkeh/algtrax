"use client";

import { ClientThemeProvider } from "@/components/ClientThemeProvider";

interface ProvidersProps {
  children: React.ReactNode;
}

export const Providers: React.FC<ProvidersProps> = ({ children }) => {
  return (
    <ClientThemeProvider>
      {children}
    </ClientThemeProvider>
  );
}; 