import { PrismaClient } from "@prisma/client"

const prisma = new PrismaClient()

const main = async () => {
    await prisma.payment.deleteMany()
    const payment = await prisma.payment.createMany({
        data: [
            {
                name: 'Qris',
                code: 'qris',
                picture: '/images/qris.png',
                status: 'Active',
            },
            {
                name: 'Tunai',
                code: 'tunai',
                picture: '/images/tunai.png',
                status: 'Active',
            }
        ]
    })

    console.log(payment)
}

main()
    .then(async () => {
        await prisma.$disconnect()
    })
    .catch(async (e) => {
        console.error(e)
        await prisma.$disconnect()
        process.exit(1)
    })

