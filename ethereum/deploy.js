const HDWalletProvider = require('truffle-hdwallet-provider');
const Web3 = require('web3');
const compiledProductFactory = require('../ethereum/buildCompiledFile/ProductFactory.json');

const provider = new HDWalletProvider(
  'decrease agree prison sure little obvious until pass traffic uncover door universe',
  'https://rinkeby.infura.io/39dLJbJbTURlN70RIdXT'
);

const web3 = new Web3(provider);

const deploy = async () => {
  const accounts = await web3.eth.getAccounts();

  console.log("Attempting to deploy from account : " , accounts[0]);

  const result = await new web3.eth.Contract(JSON.parse(compiledProductFactory.interface))
  .deploy({ data: compiledProductFactory.bytecode })
  .send({ gas: '1000000', from: accounts[0] });

  console.log("Successfully deployed address : " , result.options.address);
};

deploy();
