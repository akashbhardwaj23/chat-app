"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Button } from "@repo/ui/button";
import { Input } from "@repo/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@repo/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@repo/ui/avatar";
import { PlusCircle, Settings, LogOut, Trash2, Loader2 } from "lucide-react";
import { useAuth, useSignIn, useUser } from "@clerk/nextjs";
import { getRooms } from "@/server/rooms";
import axios from "axios";
import { BACKEND_URL } from "common/config";
import { Spinner } from "@repo/ui/spinner";

interface Room {
  id: number;
  name: string;
  description: string;
}

export default function Dashboard() {
  const [rooms, setRooms] = useState<Room[]>([]);
  const [searchQuery, setSearchQuery] = useState("");
  const router = useRouter();
  const { isLoaded } = useSignIn();
  const { user } = useUser();
  const { getToken, signOut } = useAuth();

  async function getAllRooms() {
    const token = await getToken();

    // // Need to make sure it is not undefined
    // localStorage.setItem("token", token || "")
    const rooms = await getRooms(token || "");
    setRooms(rooms);
  }

  useEffect(() => {
    getAllRooms();
  }, []);

  const filteredRooms = rooms.filter((room) =>
    room.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleDelete = async (roomId: number) => {
    const token = await getToken();
    const response = await axios.get(
      `${BACKEND_URL}/api/v1/delete-room/${roomId}`,
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );
    console.log(response);
    getAllRooms();
  };

  console.log(filteredRooms);

  if (!isLoaded) {
    return (
      <div className="flex items-center justify-center h-96">
        <Spinner />
      </div>
    );
  }

  return (
    <div className="flex h-full bg-background">
      <div className="w-52 p-4">
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
            <Button
              variant={"ghost"}
              className="w-full justify-start"
              onClick={() => router.push("/create-room")}
            >
              <PlusCircle className="mr-2 h-4 w-4" /> Create Room
            </Button>
            <Button variant="ghost" className="w-full justify-start" onClick={() => router.push("/settings")}>
              <Settings className="mr-2 h-4 w-4" /> Settings
            </Button>
            <Button
              variant="ghost"
              className="w-full justify-start text-red-500 hover:text-red-600 hover:bg-red-100 dark:hover:bg-red-900"
              onClick={async () => await signOut()}
            >
              <LogOut className="mr-2 h-4 w-4" /> Logout
            </Button>
          </nav>
      </div>

      <div className="flex-1 flex flex-col shadow-md">
        <header className="bg-background">
          <div className="max-w-7xl mx-auto py-6 px-4 sm:px-6 lg:px-8">
            <h1 className="text-3xl font-bold text-foreground">Dashboard</h1>
          </div>
        </header>
        <main className="flex-1 overflow-y-auto p-6">
          <div className="flex justify-between mb-4">
            <Input
              type="search"
              placeholder="Search rooms..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="max-w-md"
            />
            <div className="px-4 bg-background font-convergence">
              <Link href="/create-room">
                <Button variant={"room"}>
                  <PlusCircle className="mr-2 h-4 w-4" /> Create New Room
                </Button>
              </Link>
            </div>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredRooms.length > 0 ? (
              filteredRooms.map((room) => (
                <Card
                  key={room.id}
                  className="hover:shadow-lg transition-shadow"
                >
                  <CardHeader>
                    <CardTitle>{room.name}</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-sm text-gray-500 dark:text-gray-400 mb-4">
                      {room.description}
                    </p>
                    <div className="flex justify-between items-center">
                      {/* <span className="text-sm text-gray-500 dark:text-gray-400">{room.participants} participants</span> */}
                      <Button
                        onClick={() => router.push(`/chats/?roomId=${room.id}`)}
                      >
                        Join
                      </Button>
                      <Trash2
                        className="text-red-800 hover:cursor-pointer"
                        onClick={() => handleDelete(room.id)}
                      />
                    </div>
                  </CardContent>
                </Card>
              ))
            ) : (
              <div className="font-convergence"> NO ROOM FOUND CREATE ONE </div>
            )}
          </div>
        </main>
      </div>
    </div>
  );
}
