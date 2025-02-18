import { z } from "zod"


export const SignUpInputs = z.object({
    name : z.string(),
    email : z.string(),
    password : z.string()
})

export const SignInInputs = z.object({
    email : z.string(),
    password : z.string()
})

export const RoomJoinInput = z.object({
    name : z.string(),
    description : z.string()
})