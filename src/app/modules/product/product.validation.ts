import { z } from 'zod';

const alphanumeric = /^[a-zA-Z0-9]+(?: [a-zA-Z0-9]+)*$/;

const variantsValidationSchema = z.object({
  type: z
    .string()
    .trim()
    .max(30, { message: 'Variant type must be 30 or fewer characters long' })
    .regex(
      alphanumeric,
      'Variant type should only contain letters[a-z, A-z] or numbers[0-9]',
    ),

  value: z
    .string()
    .trim()
    .max(30, { message: 'Variant value must be 30 or fewer characters long' })
    .regex(
      alphanumeric,
      'Variant value should only contain letters[a-z, A-z] or numbers[0-9]',
    ),
});

const inventoryValidationSchema = z
  .object({
    quantity: z
      .number({
        message:
          'Inventory quantity should be an integer number [>0 and <=1500]',
      })
      .int({
        message:
          'Inventory quantity should be an integer number [>=0 and <=1500]',
      })
      .gte(0, {
        message: 'Inventory quantity must be greater than or equal to 0',
      })
      .lte(1500, {
        message: 'Inventory quantity must be less than or equal to 1500',
      }),
    inStock: z.boolean({
      invalid_type_error: 'inStock must be a boolean',
    }),
  })
  .refine(
    (inventoryData) => {
      if (inventoryData.quantity <= 0) {
        // If quantity is less than or equal to 0, set inStock to false
        inventoryData.inStock = false;
      } else {
        // Otherwise, set inStock to true
        inventoryData.inStock = true;
      }
      // Always return true to indicate the refinement passed
      return true;
    },
    {
      message:
        'inStock should be false when quantity is less than or equal to 0',
      path: ['inStock'],
    },
  );

export const productValidationSchema = z.object({
  name: z
    .string()
    .trim()
    .max(30, { message: 'Product name must be 30 or fewer characters long' })
    .regex(
      alphanumeric,
      'Product name should only contain letters[a-z, A-z] or numbers[0-9]',
    ),
  description: z.string().trim().max(500, {
    message: 'Product description must be 500 or fewer characters long',
  }),
  price: z.number().positive({
    message: 'Price must be a positive number',
  }),
  category: z
    .string()
    .max(30, {
      message: 'Product category must be 30 or fewer characters long',
    })
    .regex(
      alphanumeric,
      'Product category should only contain letters[a-z, A-z] or numbers[0-9]',
    ),
  tags: z
    .array(
      z
        .string()
        .max(15, { message: 'Each tag must be 15 characters or less' })
        .regex(
          alphanumeric,
          'Tag should only contain letters[a-z, A-z] or numbers[0-9]',
        ),
    )
    .nonempty({ message: 'At least one tag is required' }),
  variants: z
    .array(variantsValidationSchema)
    .nonempty({ message: 'At least one variant is required' }),
  inventory: inventoryValidationSchema,
});
