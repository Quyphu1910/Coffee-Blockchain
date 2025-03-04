// controllers/paymentController.js
const Order = require('../models/Order');
const User = require('../models/User');
const Cart = require('../models/Cart');
const Web3 = require('web3');
const web3 = new Web3(new Web3.providers.HttpProvider(process.env.GANACHE_PROVIDER_URL));
const CoffeeShopContractABI = require('../contracts/CoffeeShop.json').abi;
const coffeeShopContractAddress = process.env.COFFEE_SHOP_CONTRACT_ADDRESS;
const coffeeShopContract = new web3.eth.Contract(CoffeeShopContractABI, coffeeShopContractAddress);

exports.checkoutCart = async (req, res) => {
    try {
        const { userAddress, transactionHash, totalAmountPaid } = req.body;

        if (!userAddress || !transactionHash || !totalAmountPaid) {
            return res.status(400).json({ message: "Missing required checkout data." });
        }

        // 1. Verify Transaction on Blockchain (giữ nguyên)
        let transactionReceipt;
        try { /* ... (Transaction verification code - giữ nguyên từ orderController.confirmOrder) ... */ } catch (error) { /* ... (Error handling - giữ nguyên) ... */ }

        // 2. Find User in Database (giữ nguyên)
        const user = await User.findOne({ address: userAddress.toLowerCase() });
        if (!user) { /* ... (Error handling - giữ nguyên) ... */}

        // 3. Lấy giỏ hàng của user (giữ nguyên)
        const cart = await Cart.findOne({ userId: user._id }).populate('items.productId');
        if (!cart || cart.items.length === 0) {
            return res.status(400).json({ message: "Cart is empty. Cannot proceed to checkout." });
        }

        // 4. Lấy danh sách sản phẩm từ giỏ hàng và tính toán totalAmountPaid (từ giỏ hàng) (giữ nguyên)
        const productsInOrder = [];
        let calculatedTotalAmount = 0;
        for (const cartItem of cart.items) { /* ... (Logic lấy sản phẩm từ giỏ hàng và tính tổng tiền - giữ nguyên) ... */ }

        // 5. Validate Total Amount (optional, but good to double-check) (giữ nguyên)
        if (parseFloat(totalAmountPaid) !== calculatedTotalAmount) { /* ... (Amount validation - giữ nguyên) ... */}

        // 6. Create Order in Database (giữ nguyên, nhưng dùng productsInOrder từ giỏ hàng)
        const order = new Order({ /* ... (Tạo order object - giữ nguyên) ... */ });
        await order.save();

        // 7. Xóa giỏ hàng sau khi thanh toán thành công (giữ nguyên)
        await Cart.deleteOne({ userId: user._id });

        res.status(201).json({ message: "Order confirmed and payment processed successfully!", orderId: order.orderId }); // **Updated success message**

    } catch (error) { /* ... (Error handling - giữ nguyên) ... */ }
};