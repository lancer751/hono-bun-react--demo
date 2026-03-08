import app from "./app"

const server  = Bun.serve({
    fetch: app.fetch
})

export default server