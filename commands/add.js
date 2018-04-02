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
        console.log(`Adding ${args[1]}`);
        const category = main.validCategory(args[0]);
        const author = msg.author.id;
        if (category === null) {
            msg.reply(`Invalid category '${category}'`);
            return;
        }
        if (args.length === 3) {
            database.database().ref(main.getProjectPath(main.getUserPath(author), category)).push({
                name: args[1],
                url: args[2]
            });
            msg.reply(`Project '${args[1]}' added to ${category}!`);

            //Check role and assign if new project category
            const role = main.findRole(args[0]);
            msg.member.addRole(role)
                .then(msg.author.send('Added new role to your account!'))
                .catch((error) => console.log(error));
        } else {
            //Send message to user on error
            msg.author.send(`${main.randomErrorMessage()} Proper usage: ${main.prefix}add {category} {name} {url}`)
                .then(message => console.log(`Sent message: ${message.content} to ${msg.author.username}`))
                .catch(console.error);
        }
    },
};


