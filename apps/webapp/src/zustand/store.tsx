import { Messages } from "@/types/type";
import { clerkClient } from "@clerk/nextjs/server"; 
import { create } from "zustand"


interface ChatState {
    messages : Messages[],
    setMessage : (newChats : Messages) => void
}

export const useChatStore = create<ChatState>()((set) => ({
    messages : [],
    setMessage : (newChats ) => set(state => ({messages : [...state.messages, newChats]}))
}))

interface Token {
    token : string | null,
    setToken : () => void
}

// export const useToken = create<Token>()((set) => ({
//     token : null,
//     setToken : async() => {
//         const {getToken} = await auth()
//         const token = await getToken()
//         set({
//             token
//         })
//     }
// }))