import { Navbar } from "./navbar"


export default function Layout({
    children
}: {
    children : React.ReactNode
}){
    return (
        <body>
      {/* <ThemeProvider attribute="class" defaultTheme="system" enableSystem> */}
        <Navbar />
          <main>{children}</main>
      {/* </ThemeProvider> */}
    </body>
    
    )
}