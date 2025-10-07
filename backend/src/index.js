import express from "express";
import cors from "cors";
import { PrismaClient } from "@prisma/client";

const app = express();
const prisma = new PrismaClient();

app.use(cors({ origin: "http://localhost:5173" }));
app.use(express.json());

// 健康確認
app.get("/health", (_req, res) => res.json({ ok: true }));

// Todo一覧
app.get("/api/todos", async (_req, res) => {
  const todos = await prisma.todo.findMany({ orderBy: { id: "desc" } });
  res.json(todos);
});

// 追加
app.post("/api/todos", async (req, res) => {
  const title = (req.body?.title || "").trim();

  if (!title || title.length > 100) {
    return res.status(400).json({ error: "invalid title" });
  }

  const todo = await prisma.todo.create({ data: { title } });
  res.status(201).json(todo);
});

// 完了切替
app.patch("/api/todos/:id", async (req, res) => {
  const id = Number(req.params.id);
  const { done } = req.body ?? {};
  const todo = await prisma.todo.update({ where: { id }, data: { done: !!done } });
  res.json(todo);
});

// 削除
app.delete("/api/todos/:id", async (req, res) => {
  const id = Number(req.params.id);
  await prisma.todo.delete({ where: { id } });
  res.status(204).end();
});

app.listen(3000, () => console.log("API on :3000"));