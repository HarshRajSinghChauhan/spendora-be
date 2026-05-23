import dotenv from "dotenv";
import pg from "pg";

dotenv.config();

const { Pool } = pg;

const client = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: {
    rejectUnauthorized: false,
  },
});

const dbConnect = async () => {
  try {
    const connection = await client.connect();
    console.log("Database connected");
    connection.release(); 
  } catch (err) {
    console.log(err, "Cannot Connect to Database!");
    process.exit(1);
  }
};

export { client, dbConnect };