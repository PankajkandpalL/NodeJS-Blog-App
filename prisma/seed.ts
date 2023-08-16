import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

const userData = [{
    email : "a2@gmail.com",
      password : "ab1"
  },
  {
    email : "a3@gmail.com",
    password : "ab2"
}
];

export async function main() {
  const user = await prisma.user.createMany({
    data: userData
  })
  console.log(user)
};

main()
  .then(async () => {
    await prisma.$disconnect()
  })
  .catch(async (e) => {
    console.error(e)
    await prisma.$disconnect()
    // process.exit(1)
  });