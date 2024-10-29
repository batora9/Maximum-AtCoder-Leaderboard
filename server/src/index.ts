import { Hono } from "hono";
import { cors } from "hono/cors";

const app = new Hono<{
  Bindings: Env;
}>();

app.use(cors());

app.post("/api/atcoder/users", async (c) => {
  const users = await c.req.json();
  if (!users) return c.text("Bad Request", 400);
  if (!Array.isArray(users)) return c.text("Bad Request", 400);
  if (!users.every((user) => typeof user === "string"))
    return c.text("Bad Request", 400);
  const userData = [];
  for (const user of users) {
    const cache = await c.env.USER_CACHE.get(user);
    if (cache) {
      const { data, timestamp } = JSON.parse(cache);
      if (Date.now() - timestamp < 1000 * 60 * 60) {
        userData.push(data);
        continue;
      }
    }
    const res = await fetch(`https://atcoder.jp/users/${user}/history/json`);
    const data = await res.json();
    userData.push(data);
    await c.env.USER_CACHE.put(user, JSON.stringify({
      data,
      timestamp: Date.now(),
    }));
    await new Promise((resolve) => setTimeout(resolve, 300));
  }
  return c.json(userData);
});

export default app;
