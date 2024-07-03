import { PrismaClient } from "@prisma/client";
import { randomUUID } from "crypto";

const prisma = new PrismaClient()

async function main() {

    const roles = await prisma.roles.createMany({
        data: [
            {
                name: 'super'
            },
            {
                name: 'user'
            },
        ]
    })
    return { roles }
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