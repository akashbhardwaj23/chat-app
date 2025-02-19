import type { NextFunction, Request, Response } from "express";
import jwt from "jsonwebtoken"

export function authMiddleware(req : Request, res : Response, next : NextFunction){
    const authHeader = req.headers.authorization;

    const token = authHeader?.split(" ")[1];
    // console.log(token)
    if(!token){
        res.status(411).json({
            message : "Unauthorized"
        })
        return
    }
    console.log("Above Decoded")
    const decoded = jwt.verify(token, process.env.JWT_TOKEN || "")
    console.log(decoded)
    if(typeof decoded === "string"){
        res.status(411).json({
            message : "Unauthorized"
        })
        return
    }
    console.log("Decoded sub ",decoded.sub)

    //@ts-ignore
    req.userId = decoded.sub;

    next()
}