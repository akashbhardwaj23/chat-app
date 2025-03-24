import { auth } from "@clerk/nextjs/server"
import { redirect } from "next/navigation"

export default async function Home() {

  const { userId } = await auth();

  if(userId){
    redirect("/dashboard")
  }

  return (
    <div className="flex flex-col justify-center items-center w-full h-full dark:bg-background">
     <div className="flex justify-center items-center mb-8">
        Welcome to Chats App
     </div>
      <span className="items-center">Please Sign In to Access The Application</span>
    </div>
  )
  
}