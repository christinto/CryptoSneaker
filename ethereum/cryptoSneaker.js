import web3 from './web3';
import cryptoSneaker from '../ethereum/buildCompiledFile/CryptoSneaker.json';

export default address => {
  return new web3.eth.Contract(JSON.parse(cryptoSneaker.interface), address);
};
