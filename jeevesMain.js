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

    let args = msg.content.slice(prefix.length).split(/ +/);
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
                const projectName = args[1];
                const projectUrl = args[2];
                const projectPath = getProjectPath(getCategoryPath(userPath, category), projectName);
                database.database().ref(projectPath).set({
                    url: args[2]
                });
                msg.reply(`Project '${projectName}' added to ${category}!`);

                //Check role and assign if new project category
                const role = findRole(category);
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
            switch (args.length) {
                case 0:
                    // TODO: Print usage of delete
                    break;
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
                    const category = validCategory(args[1]);
                    const categoryPath = getCategoryPath(userPath, category);
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
            let reqTarget;
            if (args.length === 0)
                reqTarget = author;
            else if(msg.mentions.users.size === 1)
                reqTarget = msg.mentions.users.first().id;
            else
                return msg.reply(randomErrorMessage() + 'Incorrect usage: !list or !list {@member}');

                database.database()
                    .ref(getUserPath(reqTarget))
                    .once('value')
                    .then(function (snapshot) {
                        let replyString = '';
                        console.log(snapshot.val());
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

let getCategoryPath = function (userPath, category) {
    return `${userPath}/${category}`;
}

let getProjectPath = function (categoryPath, projectName) {
    return `${categoryPath}/${projectName}`;
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
