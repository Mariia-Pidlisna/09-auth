import type { Metadata } from "next";
import { Roboto } from "next/font/google";
import "./globals.css";

import { TanStackProvider } from "@/components/TanStackProvider/TanStackProvider";
import Header from "../components/Header/Header";
import Footer from "../components/Footer/Footer";
import AuthProvider from "@/components/AuthProvider/AuthProvider";

const roboto = Roboto({
  subsets: ["latin"],
  weight: ["400", "700"],
  variable: "--font-roboto",
  display: "swap",
});

export const metadata: Metadata = {
  title: "Note Hub",
  description: "NoteHub is a simple and efficient app for managing personal notes.",
  openGraph: {
   title: "Note Hub — Your personal space for notes",
    description: "A convenient app for creating, editing, and searching notes.",
    url: "https://08-zustand-iota-flame.vercel.app/",
    images: [
      {
        url: "https://ac.goit.global/fullstack/react/notehub-og-meta.jpg",
        width: 1200,
        height: 630,
         alt: "Note Hub Preview Image",
      },
    ],
      locale: "en_US",
    type: "website",
  },
};

export default function RootLayout({
  children,
  modal,
}: Readonly<{
  children: React.ReactNode;
  modal: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={roboto.variable}>
        <TanStackProvider>
           <AuthProvider>
          <Header />
          {children}
          {modal}
          <Footer />
             </AuthProvider>
        </TanStackProvider>
      </body>
    </html>
  );
}