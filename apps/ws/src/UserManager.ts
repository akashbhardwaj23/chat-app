import { client } from "db/client"
import type WebSocket from "ws"

interface RoomUsers {
    socket : WebSocket
    userId  : string
}

interface Room {
    users : RoomUsers[]
}



export class UserManager {
    // Map<roomId, Room>
    private rooms : Map<string, Room>;
    //Map<userId, User>
    private users : Map<string, WebSocket>
     constructor(){
        this.rooms = new Map();
        this.users = new Map();
    }

    public addUser(userId : string, socket : WebSocket){
        const user = this.users.get(userId);

        if(user){
            return
        }

        this.users.set(userId, socket)
    }


    public joinRoom(userId : string, socket : WebSocket, roomId : string){
        const room = this.rooms.get(roomId);
        console.log("roomId is ",roomId)
        console.log(userId)
        if(!room){
            this.createRoomAndAddUser(roomId, socket, userId)
            return
        }
        const user = room?.users.map(x => x.userId === userId);
        console.log("user is ", user)
        if(user){
            return;
        }
        room?.users.push({
            socket,
            userId
        })
        console.log("After creating room ", this.rooms)
    }

    public createRoomAndAddUser(roomId : string, socket : WebSocket, userId : string){
        this.rooms.set(roomId, {
            users : []
        })

        const room = this.rooms.get(roomId)

        room?.users.push({
            socket,
            userId
        })
        console.log("room Created")
        console.log("Rooms are ", this.rooms)
    }

    public leaveRoom(roomId : string, userId : string){
        const room = this.rooms.get(roomId)
        if(!room){
            return;
        }

        room.users = room.users.filter(x => x.userId !== userId)
    }

    async sendMessage(roomId : string, message : {
        userId : string,
        content : string
    }){
        const room = this.rooms.get(roomId);
        if(!room){
            return
        }

        const content = JSON.stringify(message)

        const chatMessage = await client.chatMessage.create({
            data : {
                message : content,  // {userId, content}
                roomId,
                userId : message.userId,
            }
        })

        console.log("room is ", room)

        room.users.map((x) => {
            if(x.userId !== message.userId){
                console.log("sending message")
                x.socket.send(JSON.stringify({
                    type : "chat",
                    roomId,
                    chat : {
                        id : chatMessage.id,
                        message : {
                            userId : message.userId,
                            content : message.content,
                        },
                        createdAt: chatMessage.createdAt
                    }
                }))
            }

            if(x.userId === message.userId){
                console.log("sending message to user")
                x.socket.send(JSON.stringify({
                    type : "chat",
                    roomId,
                    chat : {
                        id : chatMessage.id,
                        message : {
                            userId : message.userId,
                            content : message.content,
                        },
                        createdAt : chatMessage.createdAt
                    }
                }))
            }
        })
    }

    public removeUser(userId : string, socket : WebSocket  ){
        // const room = this.rooms.get(roomId)
        this.users.delete(userId)
        // if(!room){
        //     return;
        // }

        // room.users = room.users.filter(x => x.userId !== userId)
    }


}
