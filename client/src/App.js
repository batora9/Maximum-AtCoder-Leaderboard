import { useState, useEffect } from 'react';
import './App.css';

function App() {
  // AtCoderのユーザー名
  const members = [
    "batora",
    "a01sa01to",
  ];

  // 表示するデータ
  const [data, setData] = useState(null);

  // プロキシサーバー経由でデータを取得
  const fetchData = async (user) => {
    const url = `http://localhost:5000/api/atcoder/${user}`;
    try {
      const response = await fetch(url);
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      const data = await response.json();
      console.log(data);
      return data;
    } catch (error) {
      console.error("Fetch failed:", error);
    }
  };

  // ページを読み込んだときにデータを取得して表示
  const getAtCoderData = async () => {
    const promises = members.map((member) => fetchData(member));
    const results = await Promise.all(promises);
    setData(results);
  };

  // ページの読み込み時にgetAtCoderDataを実行
  useEffect(() => {
    getAtCoderData();
  }, []);

  return (
    <div className="App">
      <h1>Maximum AtCoder Leaderboard</h1>
      {data && data.map((d, index) => (
        <div key={index}>
          <h2>{members[index]}</h2>
          {d && d.map((item, index) => (
            <div key={index}>
              {/* <p>終了時間: {item.EndTime}</p> */}
              <p>増分: {item.NewRating - item.OldRating}</p>
            </div>
          ))}
        </div>
      ))}
    </div>
  );
}

export default App;
