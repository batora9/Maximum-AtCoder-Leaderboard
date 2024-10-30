import { useState, useEffect, useMemo } from "react";
import "./App.css";

function App() {
  const members = [
    "batora",
    "a01sa01to",
    "sor4chi",
    "shigek",
    "LLSTREAM",
    "NakamuraItsuk",
    "takashin",
    "hrns",
    "through",
    "yukikamome316",
    "kAsA02",
  ];
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
        const isSameMonth =
          now.getMonth() === end.getMonth() &&
          now.getFullYear() === end.getFullYear();
        const isSameYear = now.getFullYear() === end.getFullYear();

        return (
          item.ContestName &&
          (filter === "monthly"
            ? isSameMonth
            : filter === "yearly"
            ? isSameYear
            : true)
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
      期間を指定:
      <select value={filter} onChange={handleChange}>
        <option value="lifetime">全期間</option>
        <option value="monthly">月間</option>
        <option value="yearly">年間</option>
      </select>
      {sortedDataWithNames.map((user, index) => (
        <details key={index} className="user-details">
          <summary>
            {index + 1}. {user.username} 増分の合計: {user.totalIncrement}
          </summary>
          {user.data &&
            user.data.map((item, i) => (
              <div className="contest-details" key={i}>
                <p>{item.ContestName}</p>
                <p>
                  終了:{" "}
                  {new Date(item.EndTime).toLocaleString("ja-JP", {
                    year: "numeric",
                    month: "2-digit",
                    day: "2-digit",
                    hour: "2-digit",
                    minute: "2-digit",
                    second: "2-digit",
                    hour12: false,
                  })}
                </p>
                <p>増分: {item.NewRating - item.OldRating}</p>
              </div>
            ))}
        </details>
      ))}
    </div>
  );
}

export default App;
