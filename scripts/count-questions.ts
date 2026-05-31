import { prisma } from "../src/lib/prisma";

async function main() {
  const count = await prisma.question.count();
  console.log(count);
}

main()
  .catch((error) => {
    console.error(error);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
