import type { Metadata } from "next";
import "./globals.css";
import { ClerkProvider } from "@clerk/nextjs";
import Layout from "@/(navbar)/layout";

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
      <ClerkProvider>
          <Layout> {children} </Layout>
      </ClerkProvider>
    </html>
  );
}
