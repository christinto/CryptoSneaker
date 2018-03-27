const path = require('path');
const solc = require('solc');
const fs = require('fs-extra');

const buildCompiledFilePath = path.resolve(__dirname, 'buildCompiledFile');
fs.removeSync(buildCompiledFilePath);

const CryptoSneakerPath = path.resolve(__dirname, 'contacts', 'CryptoSneaker.sol');
const source = fs.readFileSync(CryptoSneakerPath, 'utf8');
const output = solc.compile(source, 1).contracts; //Get in to contacts section

fs.ensureDirSync(buildCompiledFilePath);

//Write the contracts JSON to the file
for ( let contract in output) {
  fs.outputJsonSync (
    path.resolve(buildCompiledFilePath, contract.replace(':','') + '.json'),
    output[contract]
  );
}
