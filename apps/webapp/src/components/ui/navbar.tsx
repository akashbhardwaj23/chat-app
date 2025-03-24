import { ThemeToggle } from "@/components/ui/themetoggles";
import { Button } from "@repo/ui/button";
import { SignedIn, SignedOut, SignInButton, UserButton } from "@clerk/nextjs";
import Link from "next/link";

export function Navbar() {
  return (
    <div className="bg-background p-4 m-auto">
      <div className="flex justify-between items-center px-2">
        <Link href={"/"}>
          <h1 className="text-2xl font-bold">Chat App</h1>
        </Link>
        <div className="flex items-center justify-center gap-4">
          <ThemeToggle />
          <SignedIn>
            <UserButton />
          </SignedIn>

          <SignedOut>
            <SignInButton>
              <Button variant={"default"} />
            </SignInButton>
          </SignedOut>
        </div>
      </div>
    </div>
  );
}
