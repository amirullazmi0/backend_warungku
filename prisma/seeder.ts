import { PrismaClient } from "@prisma/client";
import { randomUUID } from "crypto";
import * as bcrypt from "bcrypt";
import { JwtService } from "@nestjs/jwt";

const prisma = new PrismaClient()
const jwt = new JwtService({
    secret: 'mysecret-warungku-bosdannis',
});
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

    const userSuper = await prisma.user.createMany({
        data: [
            {
                id: randomUUID(),
                email: 'amirullazmi0@gmail.com',
                fullName: 'amirullazmi0@gmail.com',
                password: await bcrypt.hash('amirullazmi0@gmail.com', 10),
                rolesName: 'super',
                refreshToken: jwt.sign({ email: 'amirullazmi0@gmail.com' }),
                address: 'Jakarta, Indonesia'
            }
        ]
    })
    return { roles, userSuper }
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