import app from "./app";
const port = Number(process.env.PORT) || 8080;

Bun.serve({
  port,
  development: true,
  fetch: app.fetch,
  error(err) {
    let message = "";

    if (err instanceof Error) {
      message = err.stack || err.message;
    } else {
      try {
        message = JSON.stringify(err, null, 2);
      } catch {
        message = String(err);
      }
    }
    return new Response(`<pre>${message}</pre>`, {
      headers: { "Content-Type": "text/html" },
    });
  },
});