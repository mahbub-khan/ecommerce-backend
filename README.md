# How to run the application locally?

You can use "Postman" desktop application to run this backend application locally. 

Live link: https://ecommerce-backend-express-mongoose.vercel.app/

- Create a new collection in the Postman 
- Add a request in the collection in each step described below

### Step-1: Create a product

Link: https://ecommerce-backend-express-mongoose.vercel.app/api/products

Method: POST

**Sample request body:** 
```json
{
    "name": "Electric Kettle",
    "description": "Stainless steel electric kettle with auto shut-off feature.",
    "price": 39.99,
    "category": "Kitchen",
    "tags": ["kitchen", "appliance", "electric", "kettle"],
    "variants": [
      {
        "type": "capacity",
        "value": "1.5L"
      },
      {
        "type": "capacity",
        "value": "2L"
      }
    ],
    "inventory": {
      "quantity": 60,
      "inStock": true
    }
  }
```
Paste this json to the Body part and click send. You will get resoponse in return

### Step-2: Get all products

Link: https://ecommerce-backend-express-mongoose.vercel.app/api/products

Method: GET

### Step-3: Get Single product by Id

Link: https://ecommerce-backend-express-mongoose.vercel.app/api/products/ paste_Your_Product_Id_Here

Method: GET

### Step-4: Delete a product by Id

Link: https://ecommerce-backend-express-mongoose.vercel.app/api/products/ paste_Your_Product_Id_Here

Method: DELETE

### Step-5: Update a product's field by Id

Link: https://ecommerce-backend-express-mongoose.vercel.app/api/products/ paste_Your_Product_Id_Here

Method: PUT

**Sample request body:** 
```json
{
    "name": "Electric Kettle xl",
    "description": "Stainless steel electric kettle with auto shut-off feature.",
    "price": 139.99,
    "category": "Kitchen",
    "tags": ["kitchen", "appliance", "electric", "kettle"],
    "variants": [
      {
        "type": "capacity",
        "value": "5.5L"
      },
      {
        "type": "capacity",
        "value": "8L"
      }
    ],
    "inventory": {
      "quantity": 10,
      "inStock": true
    }
  }
```
Paste this json to the Body part and click send. You will get resoponse in return

### Step-6: Search products

Link: https://ecommerce-backend-express-mongoose.vercel.app/api/products?searchTerm= paste_Your_Search_Term_Here

Method: GET

My search method will look for the serchterm you provide in the product name, description and category.

### Step-7: Create a new order

Link: https://ecommerce-backend-express-mongoose.vercel.app/api/orders

Method: POST

**Sample request body:** 
```json
{
    "email": "emon@gmail.com",
    "productId": "paste_Your_Product_Id_Here",
    "price": 34.99,
    "quantity": 10
}
```
Paste this json to the Body part and click send. You will get resoponse in return

### Step-8: Get all orders

Link: https://ecommerce-backend-express-mongoose.vercel.app/api/orders

Method: GET

### Step-9: Get Single order by email

Link: https://ecommerce-backend-express-mongoose.vercel.app/api/orders?email= paste_Your_Email_Id_Here

Method: GET

- You'll get response for undefined routes as well. For example: https://ecommerce-backend-express-mongoose.vercel.app/api/orderss 

Select GET method and send a request. You will get a response like this:

```json
{
    "success": false,
    "message": "Route not found"
}
```

- All the GET methods are usable in the browser.
- Validations are added using Zod. 