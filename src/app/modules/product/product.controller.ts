import { Request, Response } from 'express';
import { ProductServices } from './product.service';
import { productValidationSchema } from './product.validation';

const createProduct = async (req: Request, res: Response) => {
  try {
    const { product: productData } = req.body;

    //product data validation with zod
    const zodParsedData = productValidationSchema.parse(productData);

    //will call service function to send this data
    const result = await ProductServices.createProductIntoDB(zodParsedData);

    //send response
    res.status(200).json({
      success: true,
      message: 'Product created successfully!',
      data: result,
    });
  } catch (err: any) {
    res.status(500).json({
      success: false,
      message: err.name || 'Something went wrong',
      error: err,
    });
  }
};

const getAllProducts = async (req: Request, res: Response) => {
  const searchTerm = req.query.searchTerm as string | undefined;
  try{
    if(searchTerm){

      const result = await ProductServices.searchProductsFromDB(searchTerm)
  
      //send response
      res.status(200).json({
        success: true,
        message: result.length > 0 ? `Products matching search term: ${searchTerm} fetched successfully!`:
        `No products found matching search term: ${searchTerm}`,
        data: result,
      });
      
    } else {
      const result = await ProductServices.getAllProductsFromDB();
  
      //send response
      res.status(200).json({
        success: true,
        message: 'Products fetched successfully!',
        data: result,
      });
  
    }

  }catch(err){
    res.status(500).json({
      success: false,
      message: 'Something went wrong',
      error: err,
    });

  }
};

const getSingleProduct = async (req: Request, res: Response) => {
  try {
    const { productId } = req.params;
    const result = await ProductServices.getSingleProductFromDB(productId);

    //send response
    res.status(200).json({
      success: true,
      message: 'Product fetched successfully!',
      data: result,
    });
  } catch (err) {
    res.status(500).json({
      success: false,
      message: 'Something went wrong',
      error: err,
    });
  }
};

const updateProduct = async(req: Request, res: Response) => {
  try {
    const {productId} = req.params;
    const { product: updatedProductData } = req.body;

    const zodParsedData = productValidationSchema.parse(updatedProductData)

    const result = await ProductServices.updateProductInDB(productId,zodParsedData);

    
    res.status(200).json({
      success: true,
      message: 'Product updated successfully!',
      data: zodParsedData,
    });

  } catch (err: any) {
    res.status(500).json({
      success: false,
      message: err.name || 'Something went wrong',
      error: err,
    });
  }

}

const deleteProduct = async(req: Request, res: Response) => {
  try {
    const {productId} = req.params;

    const result = await ProductServices.deleteProductFromDB(productId);

    
    res.status(200).json({
      success: true,
      message: 'Product deleted  successfully!',
      data: result,
    });

  } catch (err: any) {
    res.status(500).json({
      success: false,
      message: err.name || 'Something went wrong',
      error: err,
    });
  }

}


export const ProductControllers = {
  createProduct,
  getAllProducts,
  getSingleProduct,
  updateProduct,
  deleteProduct
};
