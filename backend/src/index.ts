import express from 'express';
import cookieParser from 'cookie-parser';
import cors from 'cors';
import { router } from './routes/routes';

const app = express();

app.use(cors({
  origin: ['http://localhost:3000', 'url_de_producçaõ'], // produção + dev
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
}));

app.use(express.json());
app.use(cookieParser());

app.use(router);

app.listen(4000, () => {
  console.log('Servidor rodando em http://localhost:4000');
});
