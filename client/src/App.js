import { useState, useEffect, useMemo } from "react";
import "./App.css";

function App() {
  const members = ["batora", "a01sa01to", "sor4chi", "shigek", "LLSTREAM", "NakamuraItsuk", "takashin", "hrns", "through", "yukikamome316", "kAsA02"];
  const [data, setData] = useState(null);
  const [filter, setFilter] = useState("monthly");

  // APIからデータを取得
  const fetchData = async (users) => {
    const url = `https://atcoder-api.batoran.com/api/atcoder/users`;
    try {
      const response = await fetch(url, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(users),
      });
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      const data = await response.json();
      return data;
    } catch (error) {
      console.error("Fetch failed:", error);
    }
  };

  // AtCoderのデータを取得
  const getAtCoderData = async () => {
    const data = await fetchData(members);
    setData(data);
  };

  // フィルターを適用して空の配列を除外
  const selectedData = useMemo(() => {
    if (!data) return [];
    const filteredData = data.map((d, index) => {
      const filteredContests = d.filter((item) => {
        const now = new Date();
        const end = new Date(item.EndTime);
        const isSameMonth = now.getMonth() === end.getMonth() && now.getFullYear() === end.getFullYear();
        const isSameYear = now.getFullYear() === end.getFullYear();

        return item.ContestName && (
          filter === "monthly" ? isSameMonth : filter === "yearly" ? isSameYear : true
        );
      });
      
      return { username: members[index], data: filteredContests };
    });
    
    // Remove entries with empty data arrays
    return filteredData.filter((entry) => entry.data.length > 0);
  }, [data, filter]);

  // ユーザー名とデータを結合
  const sortedDataWithNames = useMemo(() => {
    return selectedData
      .map((entry) => ({
        username: entry.username,
        data: entry.data,
        totalIncrement: entry.data.reduce(
          (acc, item) => acc + (item.NewRating - item.OldRating),
          0
        ),
      }))
      .sort((a, b) => b.totalIncrement - a.totalIncrement);
  }, [selectedData]);

  const handleChange = (e) => {
    setFilter(e.target.value);
  };

  useEffect(() => {
    getAtCoderData();
  }, []);

  return (
    <div className="App">
      <h1>Maximum AtCoder Leaderboard</h1>
      <select value={filter} onChange={handleChange}>
        <option value="lifetime">Lifetime</option>
        <option value="monthly">Monthly</option>
        <option value="yearly">Yearly</option>
      </select>
      {sortedDataWithNames.map((user, index) => (
        <div key={index}>
          <h2>
            {index + 1}. {user.username} 増分の合計: {user.totalIncrement}
          </h2>
          {user.data &&
            user.data.map((item, i) => (
              <div key={i}>
                {/* Uncomment to display additional information */}
                {/* <p>{item.ContestName}</p>
                <p>終了: {item.EndTime}</p>
                <p>増分: {item.NewRating - item.OldRating}</p> */}
              </div>
            ))}
        </div>
      ))}
    </div>
  );
}

export default App;
