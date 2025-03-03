// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

contract CoffeeShop {
    struct Product {
        uint id;
        string name;
        uint price;
    }

    struct Transaction {
        address customer;
        uint productId;
        uint amount;
        uint timestamp;
    }

    address public owner;
    mapping(address => bool) public users;
    mapping(uint => Product) public products;
    mapping(address => Transaction[]) public transactions;
    uint public productCount;

    event UserRegistered(address user);
    event ProductAdded(uint productId, string name, uint price);
    event ProductUpdated(uint productId, string name, uint price);
    event ProductDeleted(uint productId);
    event PaymentMade(address customer, uint productId, uint amount);

    modifier onlyOwner() {
        require(msg.sender == owner, "Only owner can perform this action");
        _;
    }

    constructor() {
        owner = msg.sender;
    }

    function registerUser() public {
        require(!users[msg.sender], "User already registered");
        users[msg.sender] = true;
        emit UserRegistered(msg.sender);
    }

    function addProduct(string memory name, uint price) public onlyOwner {
        productCount++;
        products[productCount] = Product(productCount, name, price);
        emit ProductAdded(productCount, name, price);
    }

    function updateProduct(uint productId, string memory name, uint price) public onlyOwner {
        require(products[productId].id != 0, "Product does not exist");
        products[productId] = Product(productId, name, price);
        emit ProductUpdated(productId, name, price);
    }

    function deleteProduct(uint productId) public onlyOwner {
        require(products[productId].id != 0, "Product does not exist");
        delete products[productId];
        emit ProductDeleted(productId);
    }

    function buyProduct(uint productId) public payable {
        require(users[msg.sender], "User not registered");
        require(products[productId].id != 0, "Product does not exist");
        require(msg.value == products[productId].price, "Incorrect value sent");

        transactions[msg.sender].push(Transaction(msg.sender, productId, msg.value, block.timestamp));
        emit PaymentMade(msg.sender, productId, msg.value);
    }

    function getTransactionHistory(address user) public view returns (Transaction[] memory) {
        return transactions[user];
    }
}
