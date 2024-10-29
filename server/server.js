import fetch from "node-fetch";
import express from "express";
const app = express();
const PORT = 5000;

// CORSを許可
app.use((req, res, next) => {
  res.header("Access-Control-Allow-Origin", "*");
  next();
});

const userCache = new Map();
let requestMutex = false;

// エンドポイントを作成
app.get("/api/atcoder/:user", async (req, res) => {
  const user = req.params.user;
  const cached = userCache.get(user);
  if (cached && Date.now() - cached.timestamp < 1000 * 60) {
    res.json(cached.data);
    return;
  }
  const url = `https://atcoder.jp/users/${user}/history/json`;

  try {
    await new Promise((resolve) => {
      if (requestMutex) {
        setTimeout(resolve, 300);
      } else {
        resolve();
      }
    });
    requestMutex = true;
    const response = await fetch(url);
    const data = await response.json();
    userCache.set(user, {
      data,
      timestamp: Date.now(),
    });
    res.json(data);
    requestMutex = false;
  } catch (error) {
    console.log(error);
    res.status(500).json({ error: "Failed to fetch data from AtCoder" });
  }
});

app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
