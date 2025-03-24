import type { Metadata } from "next";
import "./globals.css";
import { ThemeProvider } from "next-themes"
import Layout from "./home/layout";

export const metadata: Metadata = {
  title: "RealTime Chat",
  description: "Chat app",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <ThemeProvider>
      <body>
        <Layout>
          {children}
        </Layout>
        </body>
      </ThemeProvider>
    </html>
  );
}
