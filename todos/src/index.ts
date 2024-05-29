import { Server } from "./server/server";

import { ErrorMiddleware, limiter } from "./middlewares";
import { MongoClient } from "./clients";
import { routers } from "./app/routes";


const server = new Server()


server.registerMiddleware(limiter)
server.registerRouter('/todos/v1', routers)

server.registerMiddleware(ErrorMiddleware.handle)

server.listen(undefined, async () => {
    const client = new MongoClient()
    await client.connect()
    console.log(`Server is running on http://0.0.0.0:${server.port}`)
})