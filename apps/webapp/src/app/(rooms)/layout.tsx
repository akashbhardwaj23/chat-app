import { WebSocketProvider } from "@/socket/usewebsocket";
import { auth } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";


export default async function RoomLayout({children} : {children :React.ReactNode}){
    const { getToken } = await auth()
    const token = await getToken()

    if(!token){
        redirect("/")
    }

    return (
        <WebSocketProvider token={token}>
            {children}
        </WebSocketProvider>
    )
}