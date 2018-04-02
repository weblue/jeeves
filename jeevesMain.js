const Discord = require('discord.js');
const client = new Discord.Client();
const firebase = require('firebase');

const database = firebase.initializeApp({
    apiKey: "AIzaSyDjmBGDSf92A10zLJBtZt-wOX_EbTr79Us",
    authDomain: "jeeves-7facd.firebaseapp.com",
    databaseURL: "https://jeeves-7facd.firebaseio.com/"
});

const prefix = '!';
const categories = ['photography', 'video', 'streaming', 'music-production', 'web-dev', 'social-outreach', 'game-dev', 'programming'];
const roleMap = {
    'photography': 'Photography',
    'video': 'Video Production',
    'web-dev': 'Web Development',
    'music-production': 'Music Production',
    'programming': 'Programming',
    'streaming': 'Streaming',
    'social-outreach': 'Social Outreach/Branding',
    'game-dev': 'Video Game Development'
};

client.on('ready', () => {
    database.auth().signInWithEmailAndPassword("jeeves@jeeves.com", "jeeves12").catch((error => {
        console.log(error.message)
    }));
    console.log(`logged in as ${client.user.tag}!`);
});

client.on('message', msg => {
    if (!msg.content.startsWith(prefix) || msg.author.bot) return;

    console.log(`Processing: ${msg}`);

    let args = msg.content.slice(prefix.length).split(' ');
    const cmd = args.shift().toLowerCase();

    const author = msg.author.id;
    const userPath = getUserPath(author);

    switch (cmd) {

        case `ping`:
            msg.reply('pong');
            console.log(`Sent message: pong to ${msg.author.username}`);
            break;
        case `add`:
            /*
             * Ex. !add {category} {project_name} {website_link}
             *
             * - Check # of params and validate category
             * - Send new project to DB
             */
            console.log(`Adding ${args[1]}`);
            const category = validCategory(args[0]);
            if (category === null) {
                msg.reply(`Invalid category '${category}'`);
                return;
            }
            if (args.length === 3) {
                database.database().ref(getProjectPath(userPath, category)).push({
                    name: args[1],
                    url: args[2]
                });
                msg.reply(`Project '${args[1]}' added to ${category}!`);

                //Check role and assign if new project category
                const role = findRole(args[0]);
                msg.member.addRole(role)
                    .then(msg.author.send('Added new role to your account!'))
                    .catch((error) => console.log(error));
            } else {
                //Send message to user on error
                msg.author.send(`${randomErrorMessage()} Proper usage: ${prefix}add {category} {name} {url}`)
                    .then(message => console.log(`Sent message: ${message.content} to ${msg.author.username}`))
                    .catch(console.error);
            }
            break;
        case `delete`:
            /*
             * Ex. !delete {project_name}
             *     Deletes from all categories.
             *
             * Ex. !delete {project_name} {category}
             *     Deletes from input category.
             */
            const projectName = args[0];
            console.log('Args: ' + args.length);
            switch (args.length) {
                case 1:
                    // TODO: Print usage of delete
                    break;
                case 2:
                    console.log(`Deleting '${projectName}' from ALL categories`);

                    database.database()
                        .ref(userPath)
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
                    const category = validCategory(args[1]);
                    const projectPath = getProjectPath(userPath, category);
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
            break;
        case `help` :
            msg.reply('not implemented yet');
            break;
        case `list`:
            /*
             * Ex. !list
             *    Lists all projects owned by the requester author.
             *
             * Ex. !list {author}
             *    Lists all the projects owned by the author.
             */
            const reqAuthor = args.length === 0 ? author : args[0];
            database.database()
                .ref(getUserPath(reqAuthor))
                .once('value')
                .then(function (snapshot) {
                    let replyString = "";
                    snapshot.forEach((categorySnapshot) => {
                        const category = categorySnapshot.key;
                        replyString += `\t${category}\n`;
                        categorySnapshot.forEach((projSnapshot) => {
                            const project = projSnapshot.val();
                            replyString += `\t\t${project.name} ${project.url}\n`;
                        });
                    });
                    msg.author
                        .send(`Projects:\n${replyString}`)
                        .then(message => console.log(`Sent message: ${message.content} to ${msg.author.username}`))
                });

            break;
        case `invite`:
            msg.reply('not implemented yet');
            break;
        case `author`:
            msg.reply(`Your author username is ${msg.author.username}`);
            break;
        default:
            msg.author.send(`${randomErrorMessage()} That's not a command!`)
                .then(message => console.log(`Sent message: ${message.content} to ${msg.author.username}`))
                .catch(console.error)
    }
});

client.login('NDI5NzIwNjY2OTA5MDQ4ODMy.DaFwig.JkuqQ-J8KROY1hkLJUZWaK-3Qak');

//Helpers

let validCategory = function (category) {
    console.log('validating category: ' + category);
    if (category === 'Moderator') {
        console.log('This fucker just tried to add a moderator project');
        return null;
    }
    for (let i = 0; i < categories.length; i++) {
        const element = categories[i];
        if (category.toLowerCase() === element.toLowerCase()) {
            return element;
        }
    }
    return null;
};

let getAllProjectPath = function (userPath, projectName) {
    return getProjectPath(userPath, '${category}');
}

let getUserPath = function (user) {
    return `users/${user}`;
}

let getProjectPath = function (userPath, category) {
    return `${userPath}/${category}`;
}

const errorMessages = ['Please stop; you\'re killing me.', 'Error with your input!', 'What the hell are you doing?'
];

let randomErrorMessage = function () {
    let index = Math.floor(Math.random() * errorMessages.length);
    return errorMessages[index];
};

let findRole = function (role) {
    let roles = client.guilds.array()[0].roles.array();
    let found = null;
    roles.forEach((element) => {
        if (element.name === roleMap[role]) {
            found = element;
        }
    });
    if (found === null) {
        console.log('Error: role not found');
        return null;
    } else {
        return found;
    }
};
