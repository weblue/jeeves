//Imports
const Discord = require('discord.js');
const firebase = require('firebase');
const fs = require('fs');

//Config
const { prefix, firebasetoken, discordtoken } = require('./config.json');

//Commands
const commandFiles = fs.readdirSync('./commands');
commandFiles.forEach((ele) => {
    const command = require(`./commands/${ele}`);

    client.commands.set(command.name, command);
});

//Database
const database = firebase.initializeApp({
    apiKey: firebasetoken,
    authDomain: "jeeves-7facd.firebaseapp.com",
    databaseURL: "https://jeeves-7facd.firebaseio.com/"
});

//Constants
const categories = ['photography', 'video', 'streaming', 'music-production',
                    'web-dev', 'social-outreach', 'game-dev', 'programming'];
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

//Bot Client
const client = new Discord.Client();
client.commands = new Discord.Collection();

//Listeners
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



    switch (cmd) {

        case `ping`:

            break;
        case `add`:

            break;
        case `delete`:

            break;
        case `help` :
            msg.reply('not implemented yet');
            break;
        case `list`:


            break;
        case `invite`:
            msg.reply('not implemented yet');
            break;
        case `author`:

            break;
        default:
            msg.author.send(`${randomErrorMessage()} That's not a command!`)
                .then(message => console.log(`Sent message: ${message.content} to ${msg.author.username}`))
                .catch(console.error)
    }
});

client.login(discordtoken);

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


module.exports = {
    prefix,
    findRole,
    randomErrorMessage,
    getProjectPath,
    validCategory,
    getUserPath,
};