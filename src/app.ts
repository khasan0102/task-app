import express, { Request, Response } from "express"
import cors from "cors"
import path from "path"
import routes from "./routes/index"
import { expressLogger } from "./config/logger"
import { ErrorController } from "./controllers/error"
import { socket as sio } from "./lib/socket"
import http from "http";



const app = express()
const errorController = new ErrorController()
app.use(cors())
const server = new http.Server(app)
const io = require("socket.io")(server)
// middlewares
app.use(express.json())
app.use(express.urlencoded({ extended: true }))
app.use(expressLogger())
app.use(express.static(path.join(__dirname, "uploads")));

app.use(routes)



io.on("connection", function(socket: any) {
    sio(io, socket)
}); 


app.get("/status", (req: Request, res: Response) => {
    res.json({
        stauts: "OK"
    })
})

app.use(errorController.handle)

export default server
