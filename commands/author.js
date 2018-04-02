const main = require('../jeevesMain');

module.exports = {
    name: 'author',
    description: 'debug script',
    usage: `pls no`,
    execute(msg) {
        msg.reply(`Your author username is ${msg.author.username}`);
    },
};
