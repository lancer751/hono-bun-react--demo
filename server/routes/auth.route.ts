import { Hono } from "hono";
import { getUser, kindeClient, sessionManager } from "../kinde";

export const authRoute = new Hono()
  .get("/login", async (c) => {
    const loginUrl = await kindeClient.login(sessionManager(c));
    console.log(loginUrl)
    return c.redirect(loginUrl);
  })
  .get("/register", async (c) => {
    const registerUrl = await kindeClient.register(sessionManager(c));
    return c.redirect(registerUrl);
  })
  .get("/callback", async (c) => {
    // execute every time when user register or login
    const url = new URL(c.req.url)
    await kindeClient.handleRedirectToApp(sessionManager(c), url)
    return c.redirect("/")
  })
  .get("/logout" , async (c) => {
    const logoutURL = await kindeClient.logout(sessionManager(c))
    console.log("logoutURL: ", logoutURL)
    return c.redirect(logoutURL)
  })
  .get("/me", getUser, async (c) => {
    const user = c.var.user
    return c.json({user})
  })