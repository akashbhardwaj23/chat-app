import { Messages } from "@/types/type";
import { create } from "zustand"


interface ChatState {
    messages : Messages[],
    setMessage : (newChats : Messages) => void
}

export const useChatStore = create<ChatState>()((set) => ({
    messages : [],
    setMessage : (newChats ) => set(state => ({messages : [...state.messages, newChats]}))
}))