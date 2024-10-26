import './App.css';

function App() {
  // AtCoderのユーザーネームを入れる
  const members = ["batora", "a01sa01to", "shigek"];

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

  return (
    <div className="App">
      <h1>Maximum AtCoder Leaderboard</h1>
      <div>
        {members.map((member) => (
          <div key={member}>
            <h2>{member}</h2>
            <button onClick={() => fetchData(member)}>Fetch Data</button>
          </div>
        ))}
      </div>
    </div>
  );
}

export default App;
