import { decodeToken } from "../controllers/user"
import { storage } from "../storage/main"
let users = {} as { [fileadnams: string]: { id: string } }
export const socket = (io: any, socket: any) => {
    socket.on("connected", async (token: any) => {
        try {
            let { email, id } = await decodeToken(token.token)

            users[id] = {
                id: socket.id
            }
            console.log(users)
            socket.emit("users", { users })

            await storage.user.update(id, { $inc: { count_views: 1 } }, "eng")

            io.emit("hello", { user_id: id, date: "online" })
        } catch (e){
            console.log(e + "")
        }
    })

    socket.on("disconnect", async () => {
        try {
            let user_id

            for (let key in users) {
                if (users[key].id == socket.id) {
                    user_id = key
                    users[key].id = ""
                    break
                }
            }
            let date = `${new Date().getHours()}:${new Date().getMinutes()}`

            if (user_id) {
                await storage.user.update(user_id, { online_time: date }, "eng")
            }

            io.emit("hello", { user_id, date })
        } catch {}
    })
}
