const TeleBot = require('./lib/telebot');
const bot = new TeleBot('622307864:AAHIhnEhS-WhA-ElEvbcCSOCU1Hj8Xb_zUM');
const Web3 = require('web3')
const walletAddress = '0x1dC96F305645b5Ac12dDa5151eB6704677C7dB12';
const tokenContactAddr = '0x322487545d19659a11fea29526a2284151e17174';
const poolContractAddr = '0x98a9e3172cb5cf27f67fcb09fdbe5fc04715b65c';
const ERC20Contract = require('erc20-contract-js');
const web3 = new Web3(new Web3.providers.HttpProvider("https://rinkeby.infura.io/v3/2f72e1e9d96b4a018cd94093bf7006d7"));
const erc20Contract = new ERC20Contract(web3, tokenContactAddr);

const poolABI = [
 {
  "constant": false,
  "inputs": [],
  "name": "contribute",
  "outputs": [],
  "payable": true,
  "stateMutability": "payable",
  "type": "function"
 },
 {
  "anonymous": false,
  "inputs": [
   {
    "indexed": false,
    "name": "sender",
    "type": "address"
   },
   {
    "indexed": false,
    "name": "amount",
    "type": "uint256"
   }
  ],
  "name": "Deposit",
  "type": "event"
 },
 {
  "inputs": [
   {
    "name": "_dx",
    "type": "address"
   },
   {
    "name": "_weth",
    "type": "address"
   },
   {
    "name": "_token",
    "type": "address"
   },
   {
    "name": "_initialClosingPriceNum",
    "type": "uint256"
   },
   {
    "name": "_initialClosingPriceDen",
    "type": "uint256"
   }
  ],
  "payable": false,
  "stateMutability": "nonpayable",
  "type": "constructor"
 },
 {
  "constant": false,
  "inputs": [
   {
    "name": "_dx",
    "type": "address"
   }
  ],
  "name": "updateDutchExchange",
  "outputs": [],
  "payable": false,
  "stateMutability": "nonpayable",
  "type": "function"
 },
 {
  "constant": true,
  "inputs": [
   {
    "name": "",
    "type": "address"
   }
  ],
  "name": "contributerAmount",
  "outputs": [
   {
    "name": "",
    "type": "uint256"
   }
  ],
  "payable": false,
  "stateMutability": "view",
  "type": "function"
 },
 {
  "constant": true,
  "inputs": [],
  "name": "dx",
  "outputs": [
   {
    "name": "",
    "type": "address"
   }
  ],
  "payable": false,
  "stateMutability": "view",
  "type": "function"
 },
 {
  "constant": true,
  "inputs": [],
  "name": "getBalanceInUsd",
  "outputs": [
   {
    "name": "",
    "type": "uint256"
   }
  ],
  "payable": false,
  "stateMutability": "view",
  "type": "function"
 },
 {
  "constant": true,
  "inputs": [],
  "name": "owner",
  "outputs": [
   {
    "name": "",
    "type": "address"
   }
  ],
  "payable": false,
  "stateMutability": "view",
  "type": "function"
 },
 {
  "constant": true,
  "inputs": [],
  "name": "token",
  "outputs": [
   {
    "name": "",
    "type": "address"
   }
  ],
  "payable": false,
  "stateMutability": "view",
  "type": "function"
 },
 {
  "constant": true,
  "inputs": [],
  "name": "weth",
  "outputs": [
   {
    "name": "",
    "type": "address"
   }
  ],
  "payable": false,
  "stateMutability": "view",
  "type": "function"
 }
];

const userAddress = '0x013c13f69dfc7d256bbd06bd60a2a2cca9f64b3d';
const poolContractInstance = new web3.eth.Contract(poolABI, poolContractAddr);

const userBalance = async (msg, text) => {
  const balance = await web3.eth.call({
      to: poolContractAddr,
      data: poolContractInstance.methods.contributerAmount(text).encodeABI()
  });

  return msg.reply.text("Your token contribution is " + web3.utils.fromWei(balance, "ether") + ". If you would like to contribute to the pool type /yes.")
}

const poolBalance = async (msg) => {
  const balance = await web3.eth.call({
      to: poolContractAddr,
      data: poolContractInstance.methods.getBalanceInUsd().encodeABI()
  });

  return msg.reply.text("Pool balance is " + web3.utils.fromWei(balance, "ether") + ".")
}

const balance = async (msg) => {
  const result = await web3.eth.getBalance(walletAddress)
  return msg.reply.text("Your balance is " + web3.utils.fromWei(result,"ether") + ".")
}

const tbalance = async (msg) => {
  const result = await erc20Contract.balanceOf(tokenContactAddr).call()
  return msg.reply.text("Your balance is " + web3.utils.fromWei(result, "ether") + ".")
}

bot.on(['/start', '/hello'], (msg) => msg.reply.text('Welcome to PoolX! To continue enter /ub + <your ethereum address>, or enter /pool for a cool meme.'));
// type /yes. You make also check your token balance with /tkns or the current pool balance with /pb '));

bot.on('/yes', msg => msg.reply.text(`Send the amount you want to contribute to: ${poolContractAddr}. You may also query your token balance with /tkns or the pool balance with /pb.`));
bot.on('/bl', balance)
bot.on('/tkns', tbalance)
bot.on('/pb', poolBalance)
bot.on('/pool', (msg) => {
    return msg.reply.photo('https://twitter.com/i/status/1026491387049664513');
});
bot.on(/^\/ub (.+)$/, (msg, props) => {
    const text = props.match[1];
    return userBalance(msg, text);
});


bot.start();
