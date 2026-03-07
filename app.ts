import { Hono } from "hono";
import { logger } from "hono/logger";
import { expensesRoute } from "./routes/expenses.route";

const app = new Hono()

app.use("*", logger())

app.get("/test", c => c.json({greeting: "Bonno dia"}))
app.route("/api/expenses", expensesRoute)
app.get("/", c => c.text("Hello bun"))

export default app