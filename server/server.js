import fetch from 'node-fetch';
import express from 'express';
const app = express();
const PORT = 5000;

// CORSを許可
app.use((req, res, next) => {
  res.header('Access-Control-Allow-Origin', '*');
  next();
});

// エンドポイントを作成
app.get('/api/atcoder/:user', async (req, res) => {
  const user = req.params.user;
  const url = `https://atcoder.jp/users/${user}/history/json`;

  try {
    const response = await fetch(url);
    const data = await response.json();
    res.json(data);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch data from AtCoder' });
  }
});

app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
