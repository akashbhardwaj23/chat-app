"use client"
import { ClerkProvider } from "@clerk/nextjs";
import React from "react";
import {dark, neobrutalism} from "@clerk/themes"
import { useTheme } from "next-themes";



export default function ClerkLayout({
    children
}: {
    children : React.ReactNode
}){

    const {resolvedTheme} = useTheme()
    return (
        <ClerkProvider appearance={
            {
                baseTheme : resolvedTheme === "dark" ? dark : neobrutalism
            }
        }>
           {children}
      </ClerkProvider>
    )
}