import express, { Application, Request, Response } from 'express';
import cors from 'cors';
import { ProductRoutes } from './app/modules/product/product.route';
const app: Application = express();

//parsers
app.use(express.json());
app.use(cors());

//Product related routes
app.use('/api/products', ProductRoutes);

app.get('/', (req: Request, res: Response) => {

  res.send('Hi, Welcome to my App');
});

export default app;
