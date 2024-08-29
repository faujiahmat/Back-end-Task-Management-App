import dotenv from 'dotenv';
dotenv.config();
import express, { type Application } from 'express';
import cors from 'cors';
import appRouter from './routes';

const app: Application = express();
const port: number = process.env.SERVER_PORT
  ? parseInt(process.env.SERVER_PORT)
  : 8080;

app.use(express.urlencoded({ extended: true }));
app.use(express.json());

app.use(cors({ origin: true, credentials: true }));

app.use('/api', appRouter);

app.listen(port, () => {
  console.log(`Server Running on http://localhost:${port}`);
});
