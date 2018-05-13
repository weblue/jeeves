const main = require('../jeevesMain');

module.exports = {
  name: 'add',
  description: 'Add project to the database',
  usage: `${main.prefix}add {category} {project_name} {website_link}`,
  execute(msg, args) {
    /*
             * Ex. !add {category} {project_name} {website_link}
             *
             * - Check # of params and validate category
             * - Send new project to DB
             */
    if (args.length !== 0) {
      console.log(`Adding ${args[1]}`);
      const userPath = main.getUserPath(msg.author.id);
      const category = main.validCategory(args[0]);
      if (category == null) {
        throw new Error(`Invalid category '${category}'`);
      }
      if (args.length === 3) {
        const projectName = args[1];
        const projectUrl = args[2];
        const projectPath =
          main.getProjectPath(main.getCategoryPath(userPath, category), projectName);
        main.database.database().ref(projectPath).set({
          url: projectUrl,
        });
        msg.reply(`Project '${projectName}' added to ${category}!`);

        // Check role and assign if new project category
        const role = main.findRole(category);

        if (!msg.member.roles.has(role.id)) {
          msg.member.addRole(role).catch(error => console.log(error));
          msg.author.send(`Added new role, ${role.name} to your account!`);
        }
      }
    } else {
      // Send message to user on error
      throw new Error(`Usage: ${this.usage}`);
    }
  },
};

