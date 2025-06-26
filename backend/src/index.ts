import express from 'express';
import cookieParser from 'cookie-parser';
import cors from 'cors';
import { router } from './routes/routes';

const app = express();

app.use(cors({
  origin: 'http://localhost:3000', // seu frontend
  credentials: true,
}));
app.use(express.json());
app.use(cookieParser());

app.use(router);

app.listen(4000, () => {
  console.log('Servidor rodando em http://localhost:4000');
});
