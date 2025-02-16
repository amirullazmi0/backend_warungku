import { PrismaClient } from '@prisma/client';
// import { randomUUID } from 'crypto';
// import { randomUUID } from 'crypto';
import * as bcrypt from 'bcrypt';
import { JwtService } from '@nestjs/jwt';

const prisma = new PrismaClient();
const jwt = new JwtService({
  secret: 'mysecret-warungku-bosdannis',
});
async function main() {
  const address = await prisma.address.createMany({
    data: [
      {
        id: '4c8540e6-87a8-42a3-a413-58a94397b2a0',
      },
    ],
  });

  const userSuper = await prisma.user.createMany({
    data: [
      {
        id: '57f2928c-b02b-49b6-892c-1b5640c0957c',
        email: 'super@gmail.com',
        fullName: 'super@gmail.com',
        password: await bcrypt.hash('super@gmail.com', 10),
        rolesName: 'super',
        refreshToken: jwt.sign({ email: 'amirullazmi0@gmail.com' }),
        addressId: '4c8540e6-87a8-42a3-a413-58a94397b2a0',
      },
    ],
  });

  const userAddress = await prisma.userAddress.createMany({
    data: [
      {
        userId: '57f2928c-b02b-49b6-892c-1b5640c0957c',
        addressId: '4c8540e6-87a8-42a3-a413-58a94397b2a0',
      },
    ],
  });
  return { address, userSuper, userAddress };
}

main()
  .then(async () => {
    await prisma.$disconnect();
  })
  .catch(async (e) => {
    console.error(e);
    await prisma.$disconnect();
    process.exit(1);
  });
