const main = require('../jeevesMain');
const fs = require('fs');

const commands = [];
const commandFiles = fs.readdirSync('./');
commandFiles.forEach((ele) => {
  const command = require(`./${ele}`);
  commands.add(command);
});

module.exports = {
  name: 'help',
  description: 'Lists commands and their usages',
  usage: `${main.prefix}help\n Deletes from all categories or
            \n ${main.prefix}delete {project_name} {category}\n Deletes from specified category`,
  execute(msg, args) {
    /** Ex. !help
     *     Explains usage of implemented commands
     *
     * Ex. !help
     *     Lists all commands and their usages
     */
    if (args.length === 0) {
      let replyString;
      commands.forEach((command) => {
        replyString += `${main.prefix}${command.name}, ${command.description} \n Usage: ${command.usage}`;
      });

      msg.reply(replyString);
    }
    if (args.length === 1) {
      msg.reply('hello');
    } else {
      // Send message to user on error
      throw new Error(`Usage: ${this.usage}`);
    }
  },
};
