import web3 from './web3';
import productFactory from '../ethereum/buildCompiledFile/ProductFactory.json';

const instance = new web3.eth.Contract({
  JSON.parse(productFactory.interface),
  '0x0F66CcDE3440EEb0898A5650A3E3Fb5d3a8b3229'
});

export default instance;
