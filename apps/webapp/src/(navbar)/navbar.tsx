import { Button } from "@/components/ui/button";
import { SignedIn, SignedOut, SignInButton, UserButton } from "@clerk/nextjs";

export function Navbar() {
  return (
    <div className="bg-background p-4 px-4 py-4">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold">Chat App</h1>
        <SignedIn>
          <UserButton />
        </SignedIn>

        <SignedOut>
          <SignInButton><Button variant={"default"}/></SignInButton>
        </SignedOut>
      </div>
    </div>
  );
}
