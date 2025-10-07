import { useEffect, useMemo, useState } from 'react';
import { api } from '../lib/api';

export default function TodoApp() {
  const [todos, setTodos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [err, setErr] = useState('');

  // 追加フォーム用
  const [title, setTitle] = useState('');
  const [dueDate, setDueDate] = useState(''); // yyyy-mm-dd
  const [tagsInput, setTagsInput] = useState(''); // カンマ区切り "work,home"

  const apiBase = import.meta.env.VITE_API_BASE_URL;

  const tagsArray = useMemo(
    () =>
      tagsInput
        .split(',')
        .map((s) => s.trim())
        .filter(Boolean),
    [tagsInput]
  );

  async function load() {
    try {
      setLoading(true);
      setErr('');
      const data = await api.listTodos();
      setTodos(data);
    } catch (e) {
      setErr(e.message);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    load();
  }, []);

  async function handleAdd(e) {
    e.preventDefault();
    if (!title.trim()) return;
    try {
      await api.createTodo({
        title: title.trim(),
        dueDate: dueDate ? `${dueDate}T00:00:00.000Z` : null,
        tags: tagsArray,
      });
      setTitle('');
      setDueDate('');
      setTagsInput('');
      await load();
    } catch (e) {
      setErr(e.message);
    }
  }

  async function toggleCompleted(todo) {
    try {
      await api.updateTodo(todo.id, { completed: !todo.completed });
      await load();
    } catch (e) {
      setErr(e.message);
    }
  }

  async function remove(todo) {
    if (!confirm(`削除しますか？\n${todo.title}`)) return;
    try {
      await api.deleteTodo(todo.id);
      await load();
    } catch (e) {
      setErr(e.message);
    }
  }

  return (
    <div style={{ maxWidth: 720, margin: '2rem auto', padding: '0 1rem', fontFamily: 'system-ui, sans-serif' }}>
      <h1>Todo App</h1>
      <p style={{ opacity: 0.7, fontSize: 14 }}>
        API: <code>{apiBase || 'http://localhost:3001'}</code>
      </p>

      <form onSubmit={handleAdd} style={{ display: 'grid', gap: 8, margin: '1rem 0', padding: 12, border: '1px solid #ddd', borderRadius: 8 }}>
        <label>
          タイトル<br />
          <input value={title} onChange={(e) => setTitle(e.target.value)} placeholder="例: 企画書ドラフト" style={{ width: '100%' }} />
        </label>
        <label>
          期限（任意）<br />
          <input type="date" value={dueDate} onChange={(e) => setDueDate(e.target.value)} />
        </label>
        <label>
          タグ（カンマ区切り・任意）<br />
          <input value={tagsInput} onChange={(e) => setTagsInput(e.target.value)} placeholder="work, urgent など" style={{ width: '100%' }} />
        </label>
        <button type="submit">追加</button>
      </form>

      {err && <div style={{ color: 'crimson', marginBottom: 12 }}>Error: {err}</div>}
      {loading ? (
        <div>読み込み中…</div>
      ) : todos.length === 0 ? (
        <div>まだタスクがありません。</div>
      ) : (
        <ul style={{ listStyle: 'none', padding: 0, display: 'grid', gap: 8 }}>
          {todos.map((t) => {
            const overdue =
              t.dueDate && new Date(t.dueDate).getTime() < Date.now() && !t.completed;
            return (
              <li key={t.id} style={{ border: '1px solid #eee', borderRadius: 8, padding: 12, display: 'grid', gap: 6 }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                  <input
                    type="checkbox"
                    checked={t.completed}
                    onChange={() => toggleCompleted(t)}
                    aria-label="完了切替"
                  />
                  <strong style={{ textDecoration: t.completed ? 'line-through' : 'none' }}>
                    {t.title}
                  </strong>
                  {overdue && <span style={{ color: 'crimson', fontSize: 12, marginLeft: 8 }}>期限超過</span>}
                </div>
                <div style={{ fontSize: 13, opacity: 0.8 }}>
                  期限: {t.dueDate ? new Date(t.dueDate).toLocaleDateString() : '—'}
                </div>
                <div style={{ display: 'flex', gap: 6, flexWrap: 'wrap' }}>
                  {(t.tags || []).map(tag => (
                    <span key={tag.id} style={{ fontSize: 12, padding: '2px 6px', border: '1px solid #ddd', borderRadius: 999 }}>
                      #{tag.name}
                    </span>
                  ))}
                </div>
                <div style={{ display: 'flex', gap: 8 }}>
                  <button onClick={() => toggleCompleted(t)}>{t.completed ? '未完了に戻す' : '完了にする'}</button>
                  <button onClick={() => remove(t)} style={{ color: 'crimson' }}>削除</button>
                </div>
              </li>
            );
          })}
        </ul>
      )}
    </div>
  );
}
