"use client";
import { useAuth, useUser } from "@clerk/nextjs";
import { Avatar, AvatarImage, AvatarFallback } from "@repo/ui/avatar";
import { Button } from "@repo/ui/button";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@repo/ui/card";
import { Input } from "@repo/ui/input";
import { Label } from "@repo/ui/label";
import {
  LogOut,
  PlusCircle,
  Settings,
  User,
  Sun,
  Moon,
  Palette,
  ArrowLeft,
} from "lucide-react";
import { useTheme } from "next-themes";
import { useRouter } from "next/navigation";

export default function SettingsPage() {
  const { signOut } = useAuth();
  const { user } = useUser();
  const router = useRouter();

  return (
    <div className="flex h-full bg-background">
      <div className="w-52">
        <div className="p-4">
          <div className="flex items-center space-x-2 mb-4 font-convergence">
            <Avatar>
              <AvatarImage src={user?.imageUrl} alt={user?.firstName || ""} />
              <AvatarFallback>{user?.firstName}</AvatarFallback>
            </Avatar>
            <div>
              <h2 className="text-lg font-semibold">{user?.fullName}</h2>
              <p className="text-sm text-gray-500 dark:text-gray-400">
                {user?.username}
              </p>
            </div>
          </div>
          <nav className="space-y-2 font-convergence">
            <Button variant={"ghost"} className="w-full justify-start">
              <User className="h-4 w-4" /> Account
            </Button>
            <Button
              variant="ghost"
              className="w-full justify-start"
              onClick={() => router.push("/settings")}
            >
              <Palette className="h-4 w-4" /> Appearances
            </Button>
            <Button
              variant="ghost"
              className="w-full justify-start text-red-500 hover:text-red-600 hover:bg-red-100 dark:hover:bg-red-900"
              onClick={async () => await signOut()}
            >
              <LogOut className="h-4 w-4" /> Logout
            </Button>
          </nav>
        </div>
      </div>

      <div className="flex items-center justify-center bg-background w-full p-4">
        <Card className="w-full max-w-md p-4">
          <div>
            <CardContent className="space-y-4 font-convergence">
               Hi there this is a chat app
            </CardContent>
          </div>
        </Card>
      </div>
    </div>
  );
}
