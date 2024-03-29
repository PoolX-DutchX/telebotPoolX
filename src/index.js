const http = require('http');

const config = require("./configuration");
const { botNumber, poolxUrl } = config;
const TeleBot = require("./lib/telebot");
const bot = new TeleBot(botNumber);
const {
  fetchPools,
  fetchPoolNameDescriptionAddress
} = require("./helpers/fetchPools");

const poolsInfo = async msg => {
  const allPools = await fetchPools();
  const normalizedPools = allPools.map(
    async pool => await fetchPoolNameDescriptionAddress(pool)
  );
  const normPools = await Promise.all(normalizedPools);
  const newArrayOfPools = normPools.map(
    ([name, description, address], index) => `
      <strong>${index +
        1}</strong> - <a href="${poolxUrl}pools/view-pool/${address}">${name} -- ${description}</a>`
  );
  const reply = `<strong>Here is the list of pools available:</strong> ${newArrayOfPools}`;

  bot.sendMessage(msg.from.id, reply, { parseMode: "HTML" });
};

http.createServer(function (req, res) {
  res.writeHead(200, {'Content-Type': 'text/plain'});
  res.write('Hello World!');
  res.end();
}).listen(process.env.PORT);

// bot commands
bot.on(["/start", "/hello", "/help"], msg => {
  const text = `<strong>Welcome to the PoolX Telegram Bot!</strong>
See current pools and get their web addresses.
Click /pools to see current available pools.`;

  bot.sendMessage(msg.from.id, text, { parseMode: "HTML" });
});

bot.on("/pools", poolsInfo);

bot.start();

function startKeepAlive() {
  setInterval(function() {
      var options = {
          host: 'cryptic-temple-32028.herokuapp.com',
          port: process.env.PORT,
          path: '/'
      };
      http.get(options, function(res) {
          res.on('data', function(chunk) {
              try {
                  // optional logging... disable after it's working
                  console.log("HEROKU RESPONSE: " + chunk);
              } catch (err) {
                  console.log(err.message);
              }
          });
      }).on('error', function(err) {
          console.log("Error: " + err.message);
      });
  }, 20 * 60 * 1000); // load every 20 minutes
}

startKeepAlive();