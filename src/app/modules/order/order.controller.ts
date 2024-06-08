import { Request, Response } from 'express';
import { orderValidationSchema } from './order.validation';
import {  OrderServices } from './order.service';
import { ProductServices } from '../product/product.service';
import { Product } from '../product/product.model';

const createOrder = async (req: Request, res: Response) => {
  try {
    const { order: orderData } = req.body;

    //order data validation with zod
    const zodParsedOrder = orderValidationSchema.parse(orderData);

    const productId = zodParsedOrder.productId;

    //retrieving the product according to the order from Product DB
    const orderedProduct = await ProductServices.getSingleProductFromDB(productId)

    if(!orderedProduct){
      throw new Error (`No such product available with this id: ${productId}. Check again`);
    }
    

    //ensuring price matching
    if(zodParsedOrder.price !== orderedProduct.price){
      throw new Error ("Ordered price doesn't match with the product price");
    }

    //ensuring inventory quantity matching
    if(zodParsedOrder.quantity > orderedProduct.inventory.quantity){
      throw new Error ('Insufficient quantity available in inventory');
    }

    //update inventory quantity
    await Product.updateOne(
      { _id: productId },
      { $inc: { 'inventory.quantity': -zodParsedOrder.quantity }}
    )

    //set instock to false if quantity is <=0
    const updatedProduct = await Product.findById(productId);

    if(updatedProduct?.inventory.quantity <= 0){
      await Product.updateOne(
        {_id: productId},
        {$set: {'inventory.inStock': false}}
      )
    }


    const result = await OrderServices.createOrderIntoDB(zodParsedOrder);
    

    //send response
    res.status(200).json({
      success: true,
      message: 'Order created successfully!',
      data: result,
    });
  } catch (err: any) {
    res.status(500).json({
      success: false,
      message: err.issues ? err.issues[0].message :  (err.message || 'Something went wrong'),
      error: err
    });
  }
};


const getAllOrders = async (req: Request, res: Response) => {
    const userEmail = req.query.email as string | undefined;
    try {
      if (userEmail) {
        const result = await OrderServices.getEmailBasedOrdersFromDB(userEmail);
  
        //send response
        res.status(200).json({
          success: true,
          message:
            result.length > 0
              ? `Orders fetched successfully for user email: ${userEmail}`
              : `Couldn't find any orders for ${userEmail}`,
          data: result,
        });
      } else {
        const result = await OrderServices.getAllOrdersFromDB();
  
        //send response
        res.status(200).json({
          success: true,
          message: 'Orders fetched successfully!',
          data: result,
        });
      }
    } catch (err) {
      res.status(500).json({
        success: false,
        message: 'Something went wrong',
        error: err,
      });
    }
  };

export const OrderControllers = {
    createOrder,
    getAllOrders
}