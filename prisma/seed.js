const prisma = require("../prisma");

const seed = async () => {
  const authorData = await prisma.author.create({
    data: {
      name: "Yoona Choi",
      books: {
        create: [
          { title: "I Love My Chihuahua" },
          { title: "I Love My Friends & Family" },
          { title: "Who Cares? I do! :("}
        ],
      },
    },
  });

  await prisma.author.create({
    data: {
      name: "Carrie Bradshaw",
      books: {
        create: [
          { title: "Sex & The City" },
          { title: "Sex & The City Two" },
          {title: "And Just Like That"}
        ],
      },
    },
  });

  await prisma.author.create({
    data: {
      name: "Junie B Jones",
      books: {
        create: [
          { title: "I Hate My Family!" },
          { title: "Where's My Diary?" },
          {title: "Grumpy Kids Read Me"}
        ],
      },
    },
  });
};

seed()
  .then(async () => await prisma.$disconnect())
  .catch(async (e) => {
    console.error(e);
    await prisma.$disconnect();
    process.exit(1);
  });