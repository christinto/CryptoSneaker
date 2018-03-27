const assert = require('assert');
const ganache = require('ganache-cli');
const Web3 = require('web3');
const web3 = new Web3(ganache.provider());

const compiledCryptoSneaker = require('../ethereum/buildCompiledFile/CryptoSneaker.json');
const compiledProductFactory = require('../ethereum/buildCompiledFile/ProductFactory.json');


let accounts;
let factory;
let cryptosneaker;
let productAddress;

beforeEach ( async () => {
  accounts = await web3.eth.getAccounts();
  factory = await new web3.eth.Contract(JSON.parse(compiledProductFactory.interface))
  .deploy({ data: compiledProductFactory.bytecode })
  .send({
    from: accounts[0],
    gas: '1000000'
  });

  await factory.methods.createProduct('100').send({
    from: accounts[0],
    gas: '1000000'
  });

  const addresses = await factory.methods.getDeployedProduct().call();
  const productAddress = addresses[0];
  cryptosneaker = await new web3.eth.Contract(JSON.parse(compiledCryptoSneaker.interface), productAddress);
});


describe('Contract Testing', () => {

  it('deploy a cryptosneaker and factory', () => {
    assert.ok(factory.options.address);
    assert.ok(cryptosneaker.options.address);
  });

  it('marked as seller', async () => {
    const seller = await cryptosneaker.methods.sellerAddress().call();
    assert.equal(seller, accounts[0]);
  });

  //If create product request with lower price than minimumProductPrice
  it('require minimum price of the product', async () => {
    try {
      await cryptosneaker.methods.createProductRequest('Converse','Sneaker', 50).send({
        from : accounts[0],
        gas : '1000000'
      });
      assert(false);
    } catch (err) {
      assert(true);
    }
  });

  it('can create productRequest', async () => {
    await cryptosneaker.methods.createProductRequest('Converse', 'JackPurcell', web3.utils.toWei('2', 'ether')).send({
      from : accounts[0],
      gas : '1000000'
    });
    const request = await cryptosneaker.methods.requests(0).call();
    assert.equal(request.productTitle, 'Converse');
    assert.equal(request.productDescription, 'JackPurcell');
  });

  it('send higher than product price', async () => {
    await cryptosneaker.methods.createProductRequest('Converse', 'JackPurcell', web3.utils.toWei('10', 'ether')).send({
      from : accounts[0],
      gas : '1000000'
    });

    try {
      await cryptosneaker.methods.buyAProduct(0).send({
        from : accounts[1],
        value : web3.utils.toWei('11', 'ether')
      });
      assert(false);
    } catch (err) {
      assert(true);
    }
  });

  it('can buy the item', async () => {
    await cryptosneaker.methods.createProductRequest('Converse', 'JackPurcell', web3.utils.toWei('10', 'ether')).send({
      from : accounts[0],
      gas : '1000000'
    });

    await cryptosneaker.methods.buyAProduct(0).send({
      from : accounts[1],
      value : web3.utils.toWei('10', 'ether')
    })

    let balance_account0 = await web3.eth.getBalance(accounts[0]);
    balance_account0 = web3.utils.fromWei(balance_account0, 'ether');
    balance_account0 = parseFloat(balance_account0);

    let balance_account1 = await web3.eth.getBalance(accounts[1]);
    balance_account1 = web3.utils.fromWei(balance_account1, 'ether');
    balance_account1 = parseFloat(balance_account1);
    assert(balance_account0 > 105);
    assert(balance_account1 < 95);
  });

});
