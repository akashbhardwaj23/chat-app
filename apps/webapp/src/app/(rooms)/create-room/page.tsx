'use client'

import { useState } from 'react'
import { redirect, useRouter } from 'next/navigation'
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { ArrowLeft } from 'lucide-react'
import axios from 'axios'
import { BACKEND_URL } from '@/lib/config'
import { useAuth } from '@clerk/nextjs'

export default function CreateRoom() {
  const [roomName, setRoomName] = useState('');
  const [roomDescription, setRoomDescription] = useState('');
  const router = useRouter();
  const { getToken } = useAuth();
  // const token = localStorage.getItem("token")
  // if(token === null){
  //   router.push("/")
  // }
  // dont use localstora
  // const {socket, loading} = useSocket(token!)

    // const {socket, loading} = useWebSocket()
  
  // useEffect(() => {
  //   if(socket && !loading){
  //     socket.onmessage = (event) => {
  //       console.log(event.data)
  //     }
  //   }
  // }, [loading])

  const handleSubmit = async () => {
    const token = await getToken();
    if(!token){
      router.push("/")
    }
    console.log('Creating room:', { roomName, roomDescription })
    const response = await axios.post(`${BACKEND_URL}/api/v1/create-room`, {
      name : roomName,
      description : roomDescription
    }, {
      headers : {
        Authorization : `Bearer ${token}`
      }
    })

    // console.log(socket)
    // socket?.send(JSON.stringify({
    //   type : "join-room",
    //   roomId : response.data.roomId,
    //   userId : user?.id
    // }))
    router.push('/chats?roomId=' + response.data.roomId)
  }

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-100 dark:bg-gray-900 p-4">
      <Card className="w-full max-w-md">
        <CardHeader>
          <div className="flex items-center">
            <Button variant="ghost" size="icon" onClick={() => router.push('/dashboard')} className="mr-2">
              <ArrowLeft className="h-4 w-4" />
            </Button>
            <CardTitle className="text-2xl font-bold">Create a New Room</CardTitle>
          </div>
        </CardHeader>
        <div>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="roomName">Room Name</Label>
              <Input
                id="roomName"
                value={roomName}
                onChange={(e) => setRoomName(e.target.value)}
                required
                placeholder="Enter room name"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="roomDescription">Room Description</Label>
              <Textarea
                id="roomDescription"
                value={roomDescription}
                onChange={(e) => setRoomDescription(e.target.value)}
                placeholder="Describe the purpose of this room"
                rows={4}
              />
            </div>
          </CardContent>
          <CardFooter>
            <Button className="w-full" onClick={handleSubmit}>Create Room</Button>
          </CardFooter>
        </div>
      </Card>
    </div>
  )
}