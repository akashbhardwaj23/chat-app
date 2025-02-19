

import { BACKEND_URL } from "@/lib/config"
import axios from "axios"

export async function getRooms(token : string){
    const response = await axios.get(`${BACKEND_URL}/api/v1/rooms`, {
        headers : {
            Authorization : `Bearer ${token}`
        }
    })
    
    return response.data.rooms
}