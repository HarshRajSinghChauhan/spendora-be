import prisma from "./prisma.js";

const dbConnect = async () => {
  try {

    await prisma.$connect();

    console.log("Database connected");

  } catch (err) {

    console.error("Cannot connect to database:", err);

    process.exit(1);
  }
};

export default dbConnect;