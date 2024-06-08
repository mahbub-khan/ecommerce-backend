import { z } from 'zod';

export const orderValidationSchema = z.object({
  email: z.string().email('Enter a valid email'),
  productId: z.string(),
  price: z.number({
    message: 'Price must be a valid number',
  }),
  quantity: z
    .number({
      message: 'Order quantity should be an integer number',
    })
    .int({
      message: 'Order quantity should be an integer number [>=0 and <=1500]',
    })
    .gt(0, {
      message: 'Order quantity must be greater than 0',
    }),
});
