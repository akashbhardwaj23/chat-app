import express from "express"
import userRouter from "./routes/user"
import cors from "cors"
import dotenv from "dotenv"

dotenv.config()

const app = express()
app.use(cors())

app.use(express.json())

app.use("/api/v1", userRouter)


app.listen(3001, () => {
    console.log(`Sever running at Port 3001`)
})