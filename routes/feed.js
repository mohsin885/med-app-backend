const path = require('path');

const express = require('express');

const shopController = require('../controllers/feed');
const isAuth = require('../middleware/IsAuthenticated');

const router = express.Router();

router.get('/', shopController.getIndex);

router.get('/products', shopController.getProducts);
router.get('/getProductDeals', shopController.getProductDeals);

router.get('/products/:productId', shopController.getProduct);

router.get('/cart', shopController.getCart);

router.post('/cart', shopController.postCart);

router.post('/update-cart', shopController.postUpdateCart);

router.post('/cart-delete-item', shopController.postCartDeleteProduct);

router.post('/create-order', shopController.postOrder);

router.get('/orders', shopController.getOrders);
router.get('/users', shopController.getUsers);
router.delete('/user/:id', shopController.deleteUser);
router.delete('/order/:id', shopController.deleteOrder);
router.get('/orders_by_id/:id', shopController.ordersById);

module.exports = router;
