import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "FastTalk — 500+ WPM Compressed Voice Protocol",
  description: "Transform 4-second telegraphic thought bursts into 5 ready-to-ship production artifacts. Powered by AssemblyAI Dictation API.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="dark">
      <body className="min-h-screen bg-zinc-950 text-zinc-100 antialiased selection:bg-indigo-500 selection:text-white">
        {children}
      </body>
    </html>
  );
}
