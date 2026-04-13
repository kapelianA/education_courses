import express, { Express, Request, Response } from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import { PrismaClient } from '@prisma/client';
import { Pool } from 'pg';
import { PrismaPg } from '@prisma/adapter-pg';
import authRoutes from './routes/auth';
import adminRoutes from './routes/admin';
import studentRoutes from './routes/student';
import recommendationRoutes from './routes/recommendations';

dotenv.config();

const connectionString = process.env.DATABASE_URL;
const pool = new Pool({ connectionString });
const adapter = new PrismaPg(pool);

const app: Express = express();
const port = process.env.PORT || 5000;
export const prisma = new PrismaClient({ adapter });

app.use(cors());
app.use(express.json());

app.use('/api/auth', authRoutes);
app.use('/api/admin', adminRoutes);
app.use('/api/student', studentRoutes);
app.use('/api/recommendations', recommendationRoutes);

app.get('/', (req: Request, res: Response) => {
  res.send('Education Courses Recommendation System API');
});

app.listen(port, () => {
  console.log(`[server]: Server is running at http://localhost:${port}`);
});
