import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

const userData = [{
    id : 1,
      name : "a",
      password : "ab1"
  },
  {
    id : 2,
    name : "b",
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