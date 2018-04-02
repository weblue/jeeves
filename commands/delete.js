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
        const userPath = main.getUserPath(msg.author);
        switch (args.length) {
            case 1:
                console.log(`Deleting '${projectName}' from ALL categories`);

                database.database()
                    .ref(userPath)
                    .once('value')
                    .then(function (snapshot) {
                        snapshot.forEach((categorySnapshot) => {
                            const category = categorySnapshot.key;
                            categorySnapshot.forEach((projSnapshot) => {
                                const key = projSnapshot.key;
                                console.log('Project: ' + key);
                                console.log(projSnapshot.val());
                                if (key.toLowerCase() === projectName.toLowerCase()) {
                                    projSnapshot.ref.remove();
                                    console.log(`'${projectName}' deleted from ${category}`);
                                }
                            });
                        });
                        msg.reply(`'${projectName}' OBLITERATED!`);
                    });
                break;
            case 2:
                const category = main.validCategory(args[1]);
                const categoryPath = main.getCategoryPath(userPath, category);
                console.log(`Deleting '${projectName}' from ${category}`);

                database.database()
                    .ref(categoryPath)
                    .once('value')
                    .then((categorySnapshot) => {
                        categorySnapshot.forEach((projSnapshot) => {
                            const dbProjName = projSnapshot.key;
                            if (dbProjName.toLowerCase() === projectName.toLowerCase()) {
                                projSnapshot.ref.remove();
                                msg.reply(`'${dbProjName}' deleted from ${category}`);
                            }
                        });
                    });

                break;
            default:
                throw 'Usage: ' + this.usage;
        }
    },
};
