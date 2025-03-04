require('dotenv').config();
const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const multer = require('multer');
const connectDB = require('./config/db'); 
const swaggerUi = require('swagger-ui-express');
const swaggerSpec = require('./config/swagger'); 
const authRoutes = require('./routes/authRoutes');
const cartRoutes = require('./routes/cartRoutes');
const coffeeShopRoutes = require('./routes/coffeeShopRoutes');
const productRoutes = require('./routes/productRoutes');
const orderRoutes = require('./routes/orderRoutes');
const paymentRoutes = require('./routes/paymentRoutes');

const app = express();
const port = process.env.PORT || 3000;

connectDB();

app.use(cors());
app.use(express.json()); 
app.use(express.urlencoded({ extended: true })); 

// KHÔNG sử dụng multer ở đây
// const upload = multer(); 
// app.use(upload.single('image'));

app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerSpec));
app.use('/api/v1/auth', authRoutes); 
app.use('/api/v1/products', productRoutes); 
app.use('/api/v1/cart', cartRoutes); 
app.use('/api/v1/orders', orderRoutes); 
app.use('/api/v1/payment', paymentRoutes);

app.get('/', (req, res) => {
    res.send('Welcome to the API');
});

app.listen(port, () => {
    console.log(`Server listening on port ${port}`);
});