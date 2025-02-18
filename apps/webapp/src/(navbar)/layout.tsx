import { Navbar } from "./navbar"


export default function Layout({
    children
}: {
    children : React.ReactNode
}){
    return (
        <body>
        <Navbar />
          <main>{children}</main>
        </body>
    
    )
}