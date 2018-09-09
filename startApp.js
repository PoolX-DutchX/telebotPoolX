const TeleBot = require("./lib/telebot");
const bot = new TeleBot("622307864:AAHIhnEhS-WhA-ElEvbcCSOCU1Hj8Xb_zUM");
const Web3 = require("web3");
const poolContractAddr = "0x98a9e3172cb5cf27f67fcb09fdbe5fc04715b65c";
const poolABI = require("./helpers/poolABI");
const web3 = new Web3(
  new Web3.providers.HttpProvider(
    "https://rinkeby.infura.io/v3/2f72e1e9d96b4a018cd94093bf7006d7"
  )
);

const poolContractInstance = new web3.eth.Contract(poolABI, poolContractAddr);

const userBalance = async (msg, text) => {
  const balance = await web3.eth.call({
    to: poolContractAddr,
    data: poolContractInstance.methods.contributerAmount(text).encodeABI()
  });

  return msg.reply.text(
    "Your pool contribution so far is " +
      web3.utils.fromWei(balance, "ether") +
      " ether. If you would like to contribute to the pool type /yes."
  );
};

const poolBalance = async msg => {
  const balance = await web3.eth.call({
    to: poolContractAddr,
    data: poolContractInstance.methods.getBalanceInUsd().encodeABI()
  });

  return msg.reply.text(
    "Total pool contribution balance is the equivalent of " +
      web3.utils.fromWei(balance, "ether") +
      " USD in ether. 10K USD is needed to list PoolToken ;-)"
  );
};

// bot commands
bot.on(["/start", "/hello"], msg =>
  msg.reply.text(
    "Welcome to PoolX! We are pooling ether from the community to list PoolToken on the Gnosis DutchX decentralized exchange. To continue enter /enterPool + <your ethereum address>, or enter /motivateMe for a cool meme."
  )
);

bot.on("/yes", msg =>
  msg.reply.text(
    `Send the amount you want to contribute to: ${poolContractAddr}. You may also query the total pool balance with /poolBalance.`
  )
);

bot.on("/poolBalance", poolBalance);

bot.on("/motivateMe", msg => {
  return msg.reply.photo("https://twitter.com/i/status/1026491387049664513");
});

bot.on(/^\/enterPool (.+)$/, (msg, props) => {
  const text = props.match[1];
  return userBalance(msg, text);
});

bot.start();
