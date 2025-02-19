// import { createContext, useState } from "react";

// const ClerkContext = createContext<{
//     token : string | null
// }>({
//     token : null,
//     setToken : () => void
// })


// export function ClerkProvider({
//     children
// }: {
//     children : React.ReactNode
// }){
//     const [token, setToken] = useState<string | null>(null);

//     return <ClerkContext.Provider value={{token, setToken}}>
//         {children}
//     </ClerkContext.Provider>
// }