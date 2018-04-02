const main = require('../jeevesMain');

module.exports = {
  name: 'ping',
  description: 'Ping!',
  usage: `${main.prefix}ping`,
  execute(msg) {
    msg.reply('pong');
    console.log(`Sent message: pong to ${msg.author.username}`);
  },
};
