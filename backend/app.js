const express = require('express');
const app = express();
const port = 3000;
const coffeeShopRoutes = require('./routes/coffeeShopRoutes');

app.use(express.json());
app.use('/api', coffeeShopRoutes);

app.listen(port, () => {
  console.log(`Server running on http://localhost:${port}`);
});
