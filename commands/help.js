const main = require('../jeevesMain');

module.exports = {
  name: 'help',
  description: 'Lists commands and their usages',
  usage: `${main.prefix}help\n Deletes from all categories or
            \n ${main.prefix}delete {project_name} {category}\n Deletes from specified category`,
  execute(msg) {
    /** Ex. !help
     *     Explains usage of implemented commands
     *
     * Ex. !help
     *     Lists all commands and their usages
     */
    // TODO send message to author with usages of all exported modules in main
  },
};
