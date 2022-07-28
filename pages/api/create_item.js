import { PrismaClient } from "@prisma/client";

export const prisma =
  global.prisma ||
  new PrismaClient()

if (process.env.NODE_ENV !== 'production') global.prisma = prisma

export default async function handle(req, res) {
  const { method } = req
  const data = req.body

  switch (method) {
    case 'POST':
      try {
        /*if (checkItemExists(data.item_name)) {
          res.status(400).json({ error: 'Item already exists' })
        }*/
        const result = await prisma.food_item_list.create({
          data: {
            item_name: data.item_name,
            calories: parseInt(data.calories),
            carbs: parseInt(data.carbs),
            fat: parseInt(data.fat),
            proteins: parseInt(data.proteins),
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

/*async function checkItemExists(item_name) {
  const exists = await prisma.food_item_list.$exists.item_name({
    item_name: item_name,
  })
  return exists
}*/