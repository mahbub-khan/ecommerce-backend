import { Schema, model, connect } from 'mongoose';
import { TInventory, TProduct, TVariants } from './product.interface';

const variantsSchema = new Schema<TVariants>({
  type: { type: String, enum: ['size', 'color', 'style'], required: true },
  value: { type: String, required: true },
});

const inventorySchema = new Schema<TInventory>({
  quantity: { type: Number, required: true },
  inStock: { type: Boolean, required: true },
});

const productSchema = new Schema<TProduct>({
  name: { type: String, required: true },
  description: { type: String, required: true },
  price: { type: Number },
  category: { type: String, required: true },
  tags: { type: [String], default: undefined, required: true },
  variants: { type: [variantsSchema], default: undefined, required: true },
  inventory: { type: inventorySchema, required: true },
});

export const Product = model<TProduct>('Product', productSchema);
