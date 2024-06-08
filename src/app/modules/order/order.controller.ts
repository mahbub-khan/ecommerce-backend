import { Request, Response } from 'express';
import { orderValidationSchema } from './order.validation';
import {  OrderServices } from './order.service';
import { ProductServices } from '../product/product.service';
import express from 'express';
import { ProductControllers } from '../product/product.controller';
import { Product } from '../product/product.model';

const router = express.Router();

const createOrder = async (req: Request, res: Response) => {
  try {
    const { order: orderData } = req.body;

    //order data validation with zod
    const zodParsedOrder = orderValidationSchema.parse(orderData);

    const productId = zodParsedOrder.productId;
    const orderedProduct = await ProductServices.getSingleProductFromDB(productId)
    
    if(!orderedProduct){
      throw new Error (`No such product available with this id: ${productId}. Check again`);
    }
    //console.log(orderedProduct._id.toString());

    // if(productId !== orderedProduct._id.toString()){
    //   throw new Error (`No such product available with this id: ${productId}. Check again`)
    // }

    if(zodParsedOrder.quantity > orderedProduct.inventory.quantity){
      
      throw new Error ('Insufficient quantity available in inventory');
    }
    // else {
    //   router.put('/:orderedProductId/:orderedQuantity', ProductControllers.updateInventoryQuantity);
    // }

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

    //checking and modifying inventory quantity
    //if(zodParsedOrder.quantity > orderedProduct?.inventory.quantity)


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
      message: err.message || 'Something went wrong',
      error: {
        name: err.name,
        message: err.message,
        stack: err.stack,
      },
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