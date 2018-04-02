const main = require('../jeevesMain');

module.exports = {
    name: 'delete',
    description: 'Delete project from database',
    usage: `${main.prefix}delete {project_name}\n Deletes from all categories or
            \n ${main.prefix}delete {project_name} {category}\n Deletes from specified category`,
    execute(msg) {
        /*
             * Ex. !delete {project_name}
             *     Deletes from all categories.
             *
             * Ex. !delete {project_name} {category}
             *     Deletes from input category.
             */
        const projectName = args[0];
        const author = msg.author.id;
        console.log('Args: ' + args.length);
        switch (args.length) {
            case 1:
                // TODO: Print usage of delete
                break;
            case 2:
                console.log(`Deleting '${projectName}' from ALL categories`);

                database.database()
                    .ref(main.getUserPath(author))
                    .once('value')
                    .then(function (snapshot) {
                        snapshot.forEach((categorySnapshot) => {
                            const category = categorySnapshot.key;
                            categorySnapshot.forEach((projSnapshot) => {
                                const project = projSnapshot.val();
                                if (project.name.toLowerCase() === projectName.toLowerCase()) {
                                    projSnapshot.ref.remove();
                                    console.log(`'${projectName}' deleted from ${category}`);
                                }
                            });
                        });
                        msg.reply(`'${projectName}' OBLITERATED!`);
                    });
                break;
            case 3:
                const category = main.validCategory(args[1]);
                const projectPath = main.getProjectPath(main.getUserPath(author), category);
                console.log(`Deleting '${projectName}' from ${category}`);

                database.database()
                    .ref(projectPath)
                    .once('value')
                    .then((categorySnapshot) => {
                        categorySnapshot.forEach((projSnapshot) => {
                            let project = projSnapshot.val();
                            console.log('Project: ' + project.name);
                            console.log(project.name.toLowerCase() + " " + projectName.toLowerCase());
                            if (project.name.toLowerCase() === projectName.toLowerCase()) {
                                projSnapshot.ref.remove();
                                msg.reply(`'${projectName}' deleted from ${category}`);
                            }
                        });
                    });

                break;
            default:
                msg.reply('not implemented yet');
        }
    },
};
