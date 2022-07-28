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
            console.log(data)
            try {
                const result = await prisma.user_thimo.create({
                    data: {
                        Date: data.date,
                        item_id: parseInt(data.item_id),
                        amount: parseInt(data.amount),
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