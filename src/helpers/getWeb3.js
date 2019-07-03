const config = require('../configuration')
const { nodeConnection } = config
const Web3 = require('web3');
const web3 = new Web3(new Web3.providers.HttpProvider(nodeConnection));

module.exports = web3
