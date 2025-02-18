import { WebSocketServer } from "ws";
import { UserManager } from "./UserManager";
import jwt from "jsonwebtoken"
import dotenv from "dotenv"

dotenv.config()

const wss = new WebSocketServer({
    port : 8080
});

const userManager = new UserManager();

const checkUser=(token: string): string|null=>{
    try{
        const decoded=jwt.verify(token, process.env.JWT_TOKEN || "");
        console.log(decoded)
        if(typeof decoded=="string") return null;
        console.log(decoded.userId) 
        console.log("before decoded sub")
        if(!decoded.sub) return null;
        console.log("after decoded sub")
        return decoded.sub; 
    }catch(e){
        console.log("Error is ", e)
        return null;
    }
}



wss.on("connection", (ws, req) => {
    const url=req.url;
    if(!url) return;
    const queryParams=new URLSearchParams(url.split("?")[1])
    const token=queryParams.get("token")||"";
    console.log(token)
    const userId=checkUser(token);
    console.log("UserId is ", userId)
    if(userId==null){
        ws.close();
        return;
    }

    userManager.addUser(userId, ws)
    console.log("addded a user")
    ws.on("message", (data : string) => {
        const parsedData = JSON.parse(data);
        console.log(parsedData)
        
        if(parsedData.type === "join-room"){
            userManager.joinRoom(parsedData.userId, ws, parsedData.roomId);
        }

        if(parsedData.type === "chat"){
            userManager.sendMessage(parsedData.roomId, parsedData.message);
        }

        if(parsedData.type === "leave-room"){
            userManager.leaveRoom(parsedData.roomId, parsedData.userId);
        }
    })


    ws.on("close", () => {
        userManager.removeUser(userId, ws)
    })
})