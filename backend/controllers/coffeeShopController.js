const CoffeeShop = require("../models/coffeeShopModel");
const Web3 = require("web3");
const web3 = new Web3(new Web3.providers.HttpProvider("http://127.0.0.1:7545"));

exports.registerUser = async (req, res) => {
  const { address } = req.body;
  const accounts = await web3.eth.getAccounts();
  const fromAddress = accounts.includes(address) ? address : accounts[0];
  const instance = await CoffeeShop.deployed();
  await instance.registerUser({ from: fromAddress });
  res.send("User registered");
};

exports.getProduct = async (req, res) => {
  const { productId } = req.params;
  const instance = await CoffeeShop.deployed();
  const product = await instance.products(productId);
  res.json(product);
};

exports.addProduct = async (req, res) => {
  const { name, price, address } = req.body;
  const accounts = await web3.eth.getAccounts();
  const fromAddress = accounts.includes(address) ? address : accounts[0];
  const instance = await CoffeeShop.deployed();
  await instance.addProduct(name, price, { from: fromAddress });
  res.send("Product added");
};

exports.updateProduct = async (req, res) => {
  const { productId, name, price, address } = req.body;
  const accounts = await web3.eth.getAccounts();
  const fromAddress = accounts.includes(address) ? address : accounts[0];
  const instance = await CoffeeShop.deployed();
  await instance.updateProduct(productId, name, price, { from: fromAddress });
  res.send("Product updated");
};

exports.deleteProduct = async (req, res) => {
  const { productId, address } = req.body;
  const accounts = await web3.eth.getAccounts();
  const fromAddress = accounts.includes(address) ? address : accounts[0];
  const instance = await CoffeeShop.deployed();
  await instance.deleteProduct(productId, { from: fromAddress });
  res.send("Product deleted");
};

exports.buyProduct = async (req, res) => {
  const { productId, address, value } = req.body;
  const accounts = await web3.eth.getAccounts();
  const fromAddress = accounts.includes(address) ? address : accounts[0];
  const instance = await CoffeeShop.deployed();

  console.log("productId from request:", productId);
  console.log("address from request:", address);
  console.log("value from request:", value);
  console.log("fromAddress being used:", fromAddress);

  // Fetch the product price from the contract
  const product = await instance.products(productId);
  const productPrice = product.price;
  console.log("productPrice from contract:", productPrice.toString());

  // Convert the value to Wei and compare with product price
  const valueInWei = web3.utils.toWei(value, "ether");
  console.log("valueInWei calculated:", valueInWei);

  if (valueInWei !== productPrice.toString()) {
    console.log("Giá trị không khớp! Lỗi 400 trả về."); // Thêm log này
    return res.status(400).send("Incorrect value sent");
  }

  await instance.buyProduct(productId, {
    from: fromAddress,
    value: valueInWei,
  });
  res.send("Product purchased");
};

exports.login = async (req, res) => {
  const { address } = req.body;
  const accounts = await web3.eth.getAccounts();
  const fromAddress = accounts.includes(address) ? address : accounts[0];
  const instance = await CoffeeShop.deployed();
  const isRegistered = await instance.isUserRegistered(fromAddress);
  if (isRegistered) {
    res.send("Login successful");
  } else {
    res.status(401).send("User not registered");
  }
};

exports.getTransactionHistory = async (req, res) => {
  const { address } = req.params;
  const instance = await CoffeeShop.deployed();
  const transactions = await instance.getTransactionHistory(address);
  res.json(transactions);
};
