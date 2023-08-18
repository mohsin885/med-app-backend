const Product = require('../models/product');
const Order = require('../models/order');

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
exports.postOrder = (req, res, next) => {
  if(req.user.cart.items.length>0){
  req.user
    .populate('cart.items.productId')
    .execPopulate()
    .then(user => {
      const products = user.cart.items.map(i => {
        return { quantity: i.quantity, product: { ...i.productId._doc } };
      });
      const order = new Order({
        user: {
          email: req.user.email,
          userId: req.user
        },
        products: products
      });
      return order.save();
    })
    .then(result => {
      return req.user.clearCart();
    })
    .then(() => {
      res.status(201).json({
        message: 'Order created successfully',
    })
    })
    .catch(err => console.log(err));
  }
  else{
    res.status(201).json({
      success:false,
      message: 'Order creation failed',
  })
  }
};

exports.getOrders = (req, res, next) => {
  Order.find({ 'user.userId': req.user._id })
    .then(orders => {
       res.status(201).json({
        message: 'Order retrived successfully',
        success:true,
        orders:orders
    })
    })
    .catch(err => console.log(err));
};