pragma solidity ^0.4.20;

contract ProductFactory {
    address[] public deployedProduct;

    function createProduct (uint minimumPrice) public {
        address newProduct = new CryptoSneaker(minimumPrice, msg.sender);
        deployedProduct.push(newProduct);
    }

    function getDeployedProduct () public view returns (address[]){
        return deployedProduct;
    }
}

contract CryptoSneaker {

    struct ProductRequest {
        string productTitle;
        string productDescription;
        uint productPrice;
        bool isSold;
    }
    
    ProductRequest[] public requests;
    address public sellerAddress;
    uint public minimumProductPrice;

    function CryptoSneaker (uint minimumPrice, address creatorAddress) public {
        minimumProductPrice = minimumPrice;
        sellerAddress = creatorAddress;
    }

    function createProductRequest(string title, string description, uint price) public {
        require(price > minimumProductPrice);
        ProductRequest memory newProduct = ProductRequest({
            productTitle : title,
            productDescription : description,
            productPrice : price,
            isSold : false
        });
        requests.push(newProduct);
    }

    function buyAProduct(uint index) public payable{
        ProductRequest storage product = requests[index];
        require(msg.value == product.productPrice);
        sellerAddress.transfer(product.productPrice);
        product.isSold = true;
    }

}
