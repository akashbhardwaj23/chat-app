import { useAuth } from "@clerk/nextjs"



export async function isAuthenticated(){

    const { getToken }  = useAuth();

    const token = await getToken()

    if(token){
        return true
    }

    return false

}