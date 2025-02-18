
import { Button } from "@/components/ui/button"
import { redirect } from "next/navigation"

export default function Home() {
  return (
    <div className="flex justify-center items-center w-full h-full">
      Welcome to Chats App
      <Button onClick={redirect("/dashboard")}>Go To DashBoard</Button>
    </div>
  )
  
}