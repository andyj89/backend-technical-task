import express from 'express';
import cors from 'cors';
import { productsApi } from './productsApi';

const app = express();

const PORT = process.env.PORT || 3000;

app.use(cors());

app.use(express.json());

app.get('/health', (req, res) => {
  res.json({ message: 'ok' });
});

app.use('/api', productsApi);

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
