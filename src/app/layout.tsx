// src/app/layout.tsx
import "./globals.css";
import type { Metadata } from "next";
import { Inter } from "next/font/google";
import { ThemeProvider } from "@/components/theme-provider"
import { Navbar } from "@/components/Navbar"; // <-- Import the new Navbar

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "ENDTERM",
  description: "Access PYQs, Notes, and contribute to the academic community",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={inter.className}>
        <ThemeProvider
            attribute="class"
            defaultTheme="system"
            enableSystem
            disableTransitionOnChange
          >
            <Navbar /> 
            {children}
          </ThemeProvider>
      </body>
    </html>
  );
}