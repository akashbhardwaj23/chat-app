'use client'

import { useState, useEffect } from 'react'
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { ScrollArea } from "@/components/ui/scroll-area"
import { redirect, useSearchParams } from 'next/navigation'
import { useWebSocket } from '@/socket/usewebsocket'
import { useAuth, useUser } from '@clerk/nextjs'
import axios from 'axios'
import { BACKEND_URL } from '@/lib/config'
import { Messages } from '@/types/type'


export default function ChatPage() {
  const searchParams = useSearchParams()
  const { getToken } = useAuth()
  const roomId = searchParams.get("roomId")
  console.log(roomId)
  const { user } = useUser()
  const [chats, setChats] = useState<Messages[]>([])
  const [newMessage, setNewMessage] = useState("")
  const {socket, loading} = useWebSocket();

  async function getPreviousChats(){
    const token = await getToken();
    if(!token){
      redirect("/")
    }

    // Dont do this fix this
    const response = await axios.get(`${BACKEND_URL}/api/v1/previous-chat/${roomId}`, {
      headers : {
          Authorization : `Bearer ${token}`
      }
    })

    const previousChats : Messages[] = response.data.chats;
    setChats(prev => [...prev, ...previousChats])
  } 

  useEffect(() => {
    getPreviousChats()
  }, [])

  useEffect(() => {
    console.log("socket is ",socket)
    if(socket && !loading){
      socket.send(JSON.stringify({
        type : "join-room",
        roomId,
        userId : user?.id
      }))
    }
  }, [loading])

 const handleSubmit = () => {
    socket?.send(JSON.stringify({
      type : "chat",
      roomId,
      message : {
        userId : user?.id,
        content : newMessage
      }
    }))
    setNewMessage("")
 }



 const handleKeyDown = (event : any) => {
  console.log(event)
    if(event.key === "Enter"){
      handleSubmit()
    }
 }


 console.log(chats)

  const [roomName, setRoomName] = useState('')

 useEffect(() => {
    if(socket && !loading){
        socket.onmessage = (event) => {
            const data = event.data
            const parsedData = JSON.parse(data)

            if(parsedData.type === "chat"){
              console.log(parsedData)
              setChats(prev => [...prev, parsedData.chat])
            }
            
        }
    }
 },[loading])

  console.log("Chats are ", chats)

  return (
    <div className="flex flex-col bg-gray-100 dark:bg-gray-900">
      <Card className="flex-grow flex flex-col m-4">
        <CardHeader>
          <CardTitle className="text-2xl font-bold">{roomName}</CardTitle>
        </CardHeader>
        <CardContent className="flex-grow overflow-hidden">
          <ScrollArea className="h-full">
            {chats.map((chat) => (
              <div
                key={chat.id + Math.random()}
                className={`mb-4 ${
                  chat.message.userId === user?.id ? 'text-right' : 'text-left'
                }`}
              >
                <span
                  className={`inline-block p-2 rounded-lg ${
                    chat.message.userId === user?.id
                      ? 'bg-blue-500 text-white'
                      : 'bg-gray-200 dark:bg-gray-700 text-black dark:text-white'
                  }`}
                >
                  {chat.message.content}
                  {/* <span>
                    {JSON.stringify(chat.createdAt)}
                  </span> */}
                </span>


              </div>
            ))}
          </ScrollArea>
        </CardContent>
        <CardFooter>
          <div className="flex w-[96%] space-x-2 fixed bottom-2">
            <Input
              value={newMessage}
              onChange={(e) => setNewMessage(e.target.value)}
              placeholder="Type your message..."
              className="flex-grow"
              onKeyDown={handleKeyDown}
            />
            <Button type="submit" onClick={handleSubmit} onKeyDown={handleKeyDown}>Send</Button>
          </div>
        </CardFooter>
      </Card>
    </div>
  )
}