"use client";
import { SessionProvider } from "next-auth/react";
import { ThemeProvider } from "./context/ThemeContext";
import Navbar from "./components/Navbar";
import Footer from "./components/Footer";

export default function ClientProviders({ children }: { children: React.ReactNode }) {
  return (
    <SessionProvider>
      <ThemeProvider>
        <Navbar />
        {children}
        <Footer />
      </ThemeProvider>
    </SessionProvider>
  );
}
