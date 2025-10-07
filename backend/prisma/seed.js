const { PrismaClient } = require('@prisma/client')
const prisma = new PrismaClient()

async function main() {
  const tagWork = await prisma.tag.upsert({
    where: { name: 'work' }, update: {}, create: { name: 'work' },
  })
  const tagHome = await prisma.tag.upsert({
    where: { name: 'home' }, update: {}, create: { name: 'home' },
  })

  await prisma.todo.create({
    data: {
      title: '企画書ドラフト作成',
      dueDate: new Date(Date.now() + 24 * 60 * 60 * 1000),
      tags: { connect: [{ id: tagWork.id }] },
    },
  })
  await prisma.todo.create({
    data: {
      title: '買い物（牛乳・パン）',
      tags: { connect: [{ id: tagHome.id }] },
    },
  })
}

main()
  .then(async () => { console.log('Seed done'); await prisma.$disconnect() })
  .catch(async (e) => { console.error(e); await prisma.$disconnect(); process.exit(1) })
