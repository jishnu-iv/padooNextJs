import "dotenv/config";
import { PrismaMariaDb } from '@prisma/adapter-mariadb';
import { PrismaClient } from "@/src/generated/client";
 
const adapter = new PrismaMariaDb({
  host: process.env.DATABASE_HOST,
  user: process.env.DATABASE_USER,
  password: process.env.DATABASE_PASSWORD,
  database: process.env.DATABASE_NAME,
  connectionLimit:10,
  connectTimeout: 30000,
  port: Number(process.env.DATABASE_PORT) || 3306,
});
 
const prisma = new PrismaClient({ adapter });
 
export { prisma }