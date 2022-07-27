import { PrismaClient } from "@prisma/client";

export const prisma =
  global.prisma ||
  new PrismaClient()

if (process.env.NODE_ENV !== 'production') global.prisma = prisma

export default async function handle(req, res) {
  const { method } = req
  console.log(req.body)
  const data = req.body
  console.log(data)

  switch (method) {
    case 'POST':
      try {
        const result = await prisma.user_thimo.create({
          data: {
            item_name: data.item_name,
            amount: parseInt(data.amount),
            calories: parseInt(data.calories),
            carbs: parseInt(data.carbs),
            fat: parseInt(data.fat),
            proteins: parseInt(data.proteins),
            Date: data.date,
            item_id: 1, //this must obviously be changed
          },
        });
        res.json(result);
        res.status(200)
      } catch (e) {
        console.error('Request error', e)
        res.status(500).json({ error: 'Error' })
      }
      break
    default:
      res.setHeader('Allow', ['GET'])
      res.status(405).end(`Method ${method} Not Allowed`)
      break
  }
}

function checkItemExists(item_name) {
  return prisma.food_item_list.findOne({
    where: {
      item_name,
    },
  });
}