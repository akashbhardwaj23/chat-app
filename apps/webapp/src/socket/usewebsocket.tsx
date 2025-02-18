"use client"

import { WS_URL } from "@/lib/config";
import { createContext, useContext, useEffect, useState } from "react"



const WebSocketContext = createContext<{
    socket : WebSocket | null;
    loading : boolean
}>({
    socket : null,
    loading : true
});

export function WebSocketProvider({children, token}: {children : React.ReactNode, token : string}){
    const [socket, setSocket] = useState<WebSocket | null>(null);
    const [loading, setLoading] = useState<boolean>(true);


    useEffect(() => {
        const ws = new WebSocket(`${WS_URL}/?token=${token}`)

        ws.onopen = () => {
            console.log("Socket Opened")
            setSocket(ws);
            setLoading(false)
        }

        ws.onerror = () => {
            console.log("Server Stoped")
            setLoading(false)
        }
        
        return () => {
            ws.close()
        }
    }, [])
    
    return (
        <WebSocketContext.Provider value={{socket, loading}}>
            {children}
        </WebSocketContext.Provider>
    )
}

export function useWebSocket(){
    return useContext(WebSocketContext);
}
