import app from "./app";

Bun.serve({
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