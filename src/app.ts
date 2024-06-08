import express, { Application, Request, Response } from 'express';
import cors from 'cors';
import { ProductRoutes } from './app/modules/product/product.route';
import { OrderRoutes } from './app/modules/order/order.route';
const app: Application = express();

//parsers
app.use(express.json());
app.use(cors());

//Product related routes
app.use('/api/products', ProductRoutes);

//Order related routes
app.use('/api/orders', OrderRoutes);

//undefined routes
app.use((req: Request, res: Response) => {
  const error = new Error('Route not found');
  res.status(404).json({
    success: false,
    message: error.message,
  });
});

app.get('/', (req: Request, res: Response) => {
  res.send('Hi, Welcome to my App');
});

export default app;
