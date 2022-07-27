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
        const data = await prisma.user_thimo.findMany({
          where: {
            "Date": {
              gte: date,
              lte: date_end
            }
          }
        })
        data.map((item) => {
          item.Date = item.Date.toString();
        });
        const total_cal = await prisma.user_thimo.aggregate({
          where: {
            "Date": {
              gte: date,
              lte: date_end
            }
          },
          _sum: {
            "calories": true,
          },
        })
        res.status(200).json([data, total_cal])
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