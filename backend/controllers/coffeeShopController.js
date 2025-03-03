const CoffeeShop = require('../models/coffeeShopModel');
const Web3 = require('web3');
const web3 = new Web3(new Web3.providers.HttpProvider('http://127.0.0.1:7545'));

exports.registerUser = async (req, res) => {
  const { address } = req.body;
  const accounts = await web3.eth.getAccounts();
  const fromAddress = accounts.includes(address) ? address : accounts[0];
  const instance = await CoffeeShop.deployed();
  await instance.registerUser({ from: fromAddress });
  res.send('User registered');
};

exports.addProduct = async (req, res) => {
  const { name, price, address } = req.body;
  const accounts = await web3.eth.getAccounts();
  const fromAddress = accounts.includes(address) ? address : accounts[0];
  const instance = await CoffeeShop.deployed();
  await instance.addProduct(name, price, { from: fromAddress });
  res.send('Product added');
};

exports.updateProduct = async (req, res) => {
  const { productId, name, price, address } = req.body;
  const accounts = await web3.eth.getAccounts();
  const fromAddress = accounts.includes(address) ? address : accounts[0];
  const instance = await CoffeeShop.deployed();
  await instance.updateProduct(productId, name, price, { from: fromAddress });
  res.send('Product updated');
};

exports.deleteProduct = async (req, res) => {
  const { productId, address } = req.body;
  const accounts = await web3.eth.getAccounts();
  const fromAddress = accounts.includes(address) ? address : accounts[0];
  const instance = await CoffeeShop.deployed();
  await instance.deleteProduct(productId, { from: fromAddress });
  res.send('Product deleted');
};

exports.buyProduct = async (req, res) => {
  const { productId, address, value } = req.body;
  const accounts = await web3.eth.getAccounts();
  const fromAddress = accounts.includes(address) ? address : accounts[0];
  const instance = await CoffeeShop.deployed();
  await instance.buyProduct(productId, { from: fromAddress, value: web3.utils.toWei(value, 'ether') });
  res.send('Product purchased');
};

exports.login = async (req, res) => {
  const { address } = req.body;
  const accounts = await web3.eth.getAccounts();
  const fromAddress = accounts.includes(address) ? address : accounts[0];
  const instance = await CoffeeShop.deployed();
  const isRegistered = await instance.isUserRegistered(fromAddress);
  if (isRegistered) {
    res.send('Login successful');
  } else {
    res.status(401).send('User not registered');
  }
};

exports.getTransactionHistory = async (req, res) => {
  const { address } = req.params;
  const instance = await CoffeeShop.deployed();
  const transactions = await instance.getTransactionHistory(address);
  res.json(transactions);
};
