// controllers/orderController.js
const Order = require('../models/Order');
const User = require('../models/User');
const Product = require('../models/Product');
const Web3 = require('web3');
const web3 = new Web3(new Web3.providers.HttpProvider(process.env.GANACHE_PROVIDER_URL));
const CoffeeShopContractABI = require('../../build/contracts/CoffeeShop.json').abi;
const coffeeShopContractAddress = process.env.COFFEE_SHOP_CONTRACT_ADDRESS;
const coffeeShopContract = new web3.eth.Contract(CoffeeShopContractABI, coffeeShopContractAddress);


exports.confirmOrder = async (req, res) => { /* ... (same confirmOrder function from previous response) ... */ };
exports.getOrderHistoryForUser = async (req, res) => { /* ... (same getOrderHistoryForUser function from previous response) ... */ };


exports.getOrderDetails = async (req, res) => {
    try {
        const orderId = req.params.orderId;
        if (!orderId) {
            return res.status(400).json({ message: "Order ID is required." });
        }

        const order = await Order.findOne({ orderId: orderId }).populate('userId').populate('products.productId'); // Populate user and product details
        if (!order) {
            return res.status(404).json({ message: "Order not found." });
        }

        res.json(order);

    } catch (error) {
        console.error("Error getting order details:", error);
        res.status(500).json({ message: "Failed to fetch order details.", error: error.message });
    }
};

