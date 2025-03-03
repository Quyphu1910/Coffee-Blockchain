const express = require('express');
const Web3 = require('web3');
const contract = require('@truffle/contract');
const CoffeeShopArtifact = require('../build/contracts/CoffeeShop.json');

const app = express();
const port = 3000;

const web3 = new Web3(new Web3.providers.HttpProvider('http://127.0.0.1:7545'));
const CoffeeShop = contract(CoffeeShopArtifact);
CoffeeShop.setProvider(web3.currentProvider);

app.use(express.json());

app.post('/register', async (req, res) => {
  const { address } = req.body;
  const instance = await CoffeeShop.deployed();
  await instance.registerUser({ from: address });
  res.send('User registered');
});

app.post('/addProduct', async (req, res) => {
  const { name, price, address } = req.body;
  const instance = await CoffeeShop.deployed();
  await instance.addProduct(name, price, { from: address });
  res.send('Product added');
});

app.post('/updateProduct', async (req, res) => {
  const { productId, name, price, address } = req.body;
  const instance = await CoffeeShop.deployed();
  await instance.updateProduct(productId, name, price, { from: address });
  res.send('Product updated');
});

app.post('/deleteProduct', async (req, res) => {
  const { productId, address } = req.body;
  const instance = await CoffeeShop.deployed();
  await instance.deleteProduct(productId, { from: address });
  res.send('Product deleted');
});

app.post('/buyProduct', async (req, res) => {
  const { productId, address, value } = req.body;
  const instance = await CoffeeShop.deployed();
  await instance.buyProduct(productId, { from: address, value: web3.utils.toWei(value, 'ether') });
  res.send('Product purchased');
});

app.post('/login', async (req, res) => {
  const { address } = req.body;
  const instance = await CoffeeShop.deployed();
  const isRegistered = await instance.isUserRegistered(address);
  if (isRegistered) {
    res.send('Login successful');
  } else {
    res.status(401).send('User not registered');
  }
});

app.get('/transactionHistory/:address', async (req, res) => {
  const { address } = req.params;
  const instance = await CoffeeShop.deployed();
  const transactions = await instance.getTransactionHistory(address);
  res.json(transactions);
});

app.listen(port, () => {
  console.log(`Server running on http://localhost:${port}`);
});
