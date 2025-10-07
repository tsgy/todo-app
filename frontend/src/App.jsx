import { useEffect, useState } from "react";
const API = "http://localhost:3000/api/todos";

export default function App() {
  const [todos, setTodos] = useState([]);
  const [title, setTitle] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const load = async () => {
    try {
      setLoading(true);
      const res = await fetch(API);
      setTodos(await res.json());
    } catch (e) {
      setError("取得に失敗");
    } finally {
      setLoading(false);
    }
  };

  const add = async (e) => {
  e.preventDefault();
  const t = title.trim();

  // フロント側チェック
  if (!t) {
    alert("内容を入力してください。");
    return;
  }
  if (t.length > 100) {
    alert("100文字以内で入力してください。");
    return;
  }

  await fetch(API, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ title: t }),
  });
  setTitle("");
  load();
};

  const toggle = async (id, done) => {
    await fetch(`${API}/${id}`, { method:"PATCH", headers:{ "Content-Type":"application/json" }, body: JSON.stringify({ done: !done }) });
    load();
  };

  const remove = async (id) => {
    await fetch(`${API}/${id}`, { method:"DELETE" });
    load();
  };

  useEffect(() => { load(); }, []);

  if (loading) return <p>読み込み中…</p>;
  return (
    <div style={{ maxWidth: 560, margin: "2rem auto", fontFamily: "sans-serif" }}>
      {error && <p style={{color:"crimson"}}>{error}</p>}
      <h1>Todo</h1>
      <form onSubmit={add} style={{ display:"flex", gap:8, marginBottom:16 }}>
        <input value={title} onChange={(e)=>setTitle(e.target.value)} placeholder="やること" disabled={loading} />
        <button type="submit" disabled={loading}>追加</button>
      </form>
      <ul>
        {todos.map(t => (
          <li key={t.id} style={{marginBottom:8}}>
            <label>
              <input type="checkbox" checked={t.done} onChange={()=>toggle(t.id, t.done)} />
              <span style={{ marginLeft:8, textDecoration: t.done ? "line-through":"none" }}>{t.title}</span>
            </label>
            <button onClick={()=>remove(t.id)} style={{marginLeft:8}}>削除</button>
          </li>
        ))}
      </ul>
    </div>
  );
}
