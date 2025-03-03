const Web3 = require('web3');
const contract = require('@truffle/contract');
const CoffeeShopArtifact = require('../../build/contracts/CoffeeShop.json');

// Ensure the Ethereum client is running at this URL
const web3 = new Web3(new Web3.providers.HttpProvider('http://127.0.0.1:7545'));
const CoffeeShop = contract(CoffeeShopArtifact);
CoffeeShop.setProvider(web3.currentProvider);

module.exports = CoffeeShop;
