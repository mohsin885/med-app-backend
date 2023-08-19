const Product = require('../models/product');
const Order = require('../models/order');
const user = require('../models/user');

exports.getProducts = (req, res, next) => {
  Product.find()
    .then(products => {
      res.status(201).json({
        message: 'Products Retrived successfully!',
        success:true,
        products:products
        });
    })
    .catch(err => {
      console.log(err);
    });
};
exports.getProductDeals = (req, res, next) => {
  Product.find().sort({percentageOff: 'desc'}).limit(3)
    .then(products => {
      res.status(201).json({
        message: 'Daily Deals Retrived successfully!',
        success:true,
        products:products
        });
    })
    .catch(err => {
      console.log(err);
    });
};

exports.getProduct = (req, res, next) => {
  const prodId = req.params.productId;
  Product.findById(prodId)
    .then(product => {
      res.status(201).json({
        message: 'Product Retrived successfully!',
        success:true,
        product:product
        });
    })
    .catch(err => console.log(err));
};

exports.getIndex = (req, res, next) => {
  Product.find()
    .then(products => {
      res.json
    })
    .catch(err => {
      console.log(err);
    });
};

exports.getCart = (req, res, next) => {
  req.user
    .populate('cart.items.productId')
    .execPopulate()
    .then(user => {
      const products = user.cart.items;
      res.status(201).json({
        message: 'Cart Retrived Sucessfully',
        success:true,
        products:products
        });
    })
    .catch(err => console.log(err));
};

exports.postCart = (req, res, next) => {
  console.log(req.userId);
  const prodId = req.body.productId;
  Product.findById(prodId)
    .then(product => {
      return req.user.addToCart(product);
    })
    .then(result => {
      result.populate('cart.items.productId').execPopulate().then(user=>{
      res.status(201).json({
        message: 'Product successfully added to cart!',
        success:true,
        products:user.cart.items
        });
      });
    });
};

exports.postUpdateCart = (req, res, next) => {
  console.log(req.userId);
  const prodId = req.body.productId;
  const quantity=req.body.quantity;
  Product.findById(prodId)
    .then(product => {
      return req.user.addToCart(product,quantity);
    })
    .then(result => {
      result.populate('cart.items.productId').execPopulate().then(user=>{
        res.status(201).json({
          message: 'Cart Updated Successfully',
          success:true,
          products:user.cart.items
          });
      })
      
    });
};

exports.postCartDeleteProduct = (req, res, next) => {
  const prodId = req.body.productId;
  req.user
    .removeFromCart(prodId)
    .then(result => {
      result.populate('cart.items.productId').execPopulate().then(user=>{
      res.status(201).json({
        message: 'Product successfully removed from cart!',
        success:true,
        products:user.cart.items
    })
    })
    .catch(err => console.log(err));
  })
};

exports.postOrder = async(req, res, next) => {
  try {
    const data = req.body;

    const order = new Order({
      user: {
        email: data.user.name,
        userId: data.user.userId,
      },
      products: data.cart.map(item => ({
        product: item.id,
        quantity: item.qty,
      })),
    });

    // Save the order instance to the database
    const savedOrder = await order.save();
    
    res.json(savedOrder);
  } catch (error) {
    console.error('Error saving order:', error);
    res.status(500).json({ error: 'Error saving order' });
  }
};

exports.getOrders = async(req, res, next) => {
  try {
    // Retrieve all orders from the database and populate user and product details
    const orders = await Order.find()
      .populate({
        path: 'user.userId',
        select: 'name email'
      })
      .populate({
        path: 'products.product',
        select: 'name price qty',
      })
      .exec();

    // Send the list of orders with populated details as a JSON response
    res.json(orders);
  } catch (error) {
    console.error('Error fetching orders:', error);
    res.status(500).json({ error: 'Error fetching orders' });
  }
};

exports.getUsers = async(req, res, next) => {
  try {
    const users = await user.find();
    res.json(users);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Server error" });
  }
};