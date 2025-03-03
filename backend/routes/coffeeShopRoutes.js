const express = require('express');
const router = express.Router();
const coffeeShopController = require('../controllers/coffeeShopController');

router.post('/register', coffeeShopController.registerUser);
router.get('/product/:productId', coffeeShopController.getProduct);
router.post('/addProduct', coffeeShopController.addProduct);
router.post('/updateProduct', coffeeShopController.updateProduct);
router.post('/deleteProduct', coffeeShopController.deleteProduct);
router.post('/buyProduct', coffeeShopController.buyProduct);
router.post('/login', coffeeShopController.login);
router.get('/transactionHistory/:address', coffeeShopController.getTransactionHistory);

module.exports = router;
