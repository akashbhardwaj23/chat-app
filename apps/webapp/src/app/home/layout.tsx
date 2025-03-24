import ClerkLayout from "../(clerk)/layout";
import { Navbar } from "@/components/ui/navbar";

export default function Layout({ children }: { children: React.ReactNode }) {
  return (
      <ClerkLayout>
        <Navbar />
        {children}
      </ClerkLayout>
  );
}
