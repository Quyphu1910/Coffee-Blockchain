require('dotenv').config();
const express = require('express');
const cors = require('cors');
const connectDB = require('./config/db'); 
const swaggerUi = require('swagger-ui-express');
const swaggerSpec = require('./config/swagger'); 
const authRoutes = require('./routes/authRoutes');
const cartRoutes = require('./routes/cartRoutes');
const coffeeShopRoutes = require('./routes/coffeeShopRoutes');
const productRoutes = require('./routes/productRoutes');
const orderRoutes = require('./routes/orderRoutes');

const app = express();
const port = process.env.PORT || 3000;

connectDB();

app.use(cors());
app.use(express.json()); 

app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerSpec));
app.use('/api/v1/auth', authRoutes); 
app.use('/api/v1/products', productRoutes); 
app.use('/api/v1/cart', cartRoutes); 
app.use('/api/v1/orders', orderRoutes); 

app.get('/', (req, res) => {
    res.send('Welcome to the API');
});

app.listen(port, () => {
    console.log(`Server listening on port ${port}`);
});