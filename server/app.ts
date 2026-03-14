import { Hono } from "hono";
import { logger } from "hono/logger";
import { expensesRoute } from "./routes/expenses.route";
import { serveStatic } from 'hono/bun'

const app = new Hono()

app.use("*", logger())
const apiRoutes = app.basePath("/api").route("/expenses", expensesRoute)
app.get("/", (c) => {
  return c.json({ status: "ok" })
})
// serving all files from folder dist
app.get("*", serveStatic({root: "../public"}))
// serving index.html as fallback in case one page doesn't match
app.get("*", serveStatic({path: "../public/index.html"}))

export default app
export type ApiRoutes = typeof apiRoutes