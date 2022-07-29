import { PrismaClient } from "@prisma/client";

export const prisma =
  global.prisma ||
  new PrismaClient()

if (process.env.NODE_ENV !== 'production') global.prisma = prisma

export default async function handle(req, res) {
  const { method } = req
  const { date, date_end } = req.query
  switch (method) {
    case 'GET':
      try {
        const day = await getDayItems(date, date_end)
        const item_list = await getItemList()
        res.status(200).json([day[0], day[1], item_list])
      } catch (e) {
        console.error('Request error', e)
        res.status(500).json({ error: 'Error fetching posts' })
      }
      break
    default:
      res.setHeader('Allow', ['GET'])
      res.status(405).end(`Method ${method} Not Allowed`)
      break
  }
}

async function getDayItems(date, date_end) {
  var day_totals = [0, 0, 0, 0]
  const day_items = await prisma.user_thimo.findMany({
    select: {
      item_id: true,
      amount: true,
      Date: true,
      food: true,
    },
    where: {
      "Date": {
        gte: date,
        lte: date_end
      },
    }
  })
  day_items.map((item) => {
    item.Date = item.Date.toString();
    day_totals[0] += item.food.calories * item.amount
    day_totals[1] += item.food.proteins * item.amount
    day_totals[2] += item.food.carbs * item.amount
    day_totals[3] += item.food.fat * item.amount
  });
  return [day_items, day_totals]
}

async function getItemList() {
  const item_list = await prisma.food_item_list.findMany({
    orderBy: { item_name: 'asc' },
  })
  return item_list
}