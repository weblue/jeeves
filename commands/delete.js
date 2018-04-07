const main = require('../jeevesMain');

function checkAndRemoveOnLastProject(msg) {
  let categories = main.categories.slice(0);

  main.database.database()
    .ref(main.getUserPath(msg.author))
    .once('value')
    .then((snapshot) => {
      snapshot.forEach((categorySnapshot) => {
        const category = categorySnapshot.key;

        const found = { found: false, index: -1 };
        for (let i = 0; i < categories.length; i += 1) {
          if (category === categories[i]) {
            found.found = true;
            found.index = i;
          }
        }

        if (found.found) {
          categories = categories.splice(found.index, 1);
        }
      });

      categories.forEach((category) => {
        const role = main.findRole(category);
        msg.member.removeRole(role)
          .catch(error => console.log(error));
      });
    });
}

module.exports = {
  name: 'delete',
  description: 'Delete project from database',
  usage: `${main.prefix}delete {project_name}\n Deletes from all categories or
            \n ${main.prefix}delete {project_name} {category}\n Deletes from specified category`,
  execute(msg, args) {
    /** Ex. !delete {project_name}
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

        main.database.database()
          .ref(userPath)
          .once('value')
          .then((snapshot) => {
            snapshot.forEach((categorySnapshot) => {
              const category = categorySnapshot.key;
              categorySnapshot.forEach((projSnapshot) => {
                const { key } = projSnapshot;
                console.log(`Project: ${key}`);
                console.log(projSnapshot.val());

                if (key.toLowerCase() === projectName.toLowerCase()) {
                  projSnapshot.ref.remove();
                  console.log(`'${projectName}' deleted from ${category}`);
                }
              });
            });
            msg.reply(`'${projectName}' OBLITERATED!`);
          });
        checkAndRemoveOnLastProject(msg);
        break;
      case 2: {
        const category = main.validCategory(args[1]);
        const categoryPath = main.getCategoryPath(userPath, category);
        console.log(`Deleting '${projectName}' from ${category}`);

        main.database.database()
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
      }

        break;
      default: {
        throw new Error(`Usage: ${this.usage}`);
      }
    }
  },
};
