const router = require('express').Router()
const { PrismaClient } = require('@prisma/client')
const prisma = new PrismaClient()

// 一覧（タグ含む）
router.get('/', async (_req, res) => {
  const todos = await prisma.todo.findMany({ orderBy: { id: 'desc' }, include: { tags: true } })
  res.json(todos)
})

// 作成（title 必須, tags は ['work','home'] など）
router.post('/', async (req, res) => {
  const { title, dueDate, tags } = req.body
  if (!title) return res.status(400).json({ message: 'title required' })

  const connectOrCreate = Array.isArray(tags)
    ? tags.map((name) => ({ where: { name }, create: { name } }))
    : []

  const todo = await prisma.todo.create({
    data: {
      title,
      dueDate: dueDate ? new Date(dueDate) : null,
      tags: { connectOrCreate }
    },
    include: { tags: true }
  })
  res.status(201).json(todo)
})

// 更新（completed など）
router.put('/:id', async (req, res) => {
  const id = Number(req.params.id)
  const { title, completed, dueDate, tags } = req.body

  let setTags
  if (Array.isArray(tags)) {
    const ensured = await Promise.all(tags.map((name) =>
      prisma.tag.upsert({ where: { name }, update: {}, create: { name } })
    ))
    setTags = ensured.map(t => ({ id: t.id }))
  }

  try {
    const updated = await prisma.todo.update({
      where: { id },
      data: {
        title,
        completed,
        dueDate: dueDate ? new Date(dueDate) : null,
        ...(setTags ? { tags: { set: setTags } } : {})
      },
      include: { tags: true }
    })
    res.json(updated)
  } catch {
    res.status(404).json({ message: 'not found' })
  }
})

router.delete('/:id', async (req, res) => {
  const id = Number(req.params.id)
  try {
    await prisma.todo.delete({ where: { id } })
    res.status(204).end()
  } catch {
    res.status(404).json({ message: 'not found' })
  }
})

module.exports = router
