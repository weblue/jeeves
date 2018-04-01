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
    if (msg.content.startsWith(`${prefix}`)) {
        let strings = msg.content.split(' ');

        switch (strings[0]) {
            case `${prefix}ping`:
                msg.reply('pong');
                console.log(`Sent message: pong to ${msg.author.username}`);
                break;
            case `${prefix}add`:
                //Check # of params and check for valid category
                //Send new project to DB
                if (strings.length === 4 && validCategory(strings[1])) {
                    database.database().ref(`users/${msg.author.id}/${strings[1]}`).set({
                        name: strings[2],
                        url: strings [3]
                    });
                    msg.reply('Project added!');
                    //Check role and assign if new project category
                    msg.member.addRole(findRole(strings[1]), 'Project added in category')
                } else {
                    //Send message to user on error
                    msg.author.send(`${randomErrorMessage()} Proper usage: ${prefix}add {category} {name} {url}`)
                        .then(message => console.log(`Sent message: ${message.content} to ${msg.author.username}`))
                        .catch(console.error);
                }
                break;
            case `${prefix}delete`:
                msg.reply('not implemented yet');
                break;
            case `${prefix}help` :
                msg.reply('not implemented yet');
                break;
            case `${prefix}list`:
                msg.reply('not implemented yet');
                break;
            case `${prefix}invite`:
                msg.reply('not implemented yet');
                break;
            default:
                msg.author.send(`${randomErrorMessage()} That's not a command!`)
                    .then(message => console.log(`Sent message: ${message.content} to ${msg.author.username}`))
                    .catch(console.error)
        }
    }
});

client.login('NDI5NzIwNjY2OTA5MDQ4ODMy.DaFwig.JkuqQ-J8KROY1hkLJUZWaK-3Qak');

//Helpers

let validCategory = function (category) {
    if (category === 'Moderator') {
        console.log('This fucker just tried to add a moderator project');
        return false;
    }
    categories.forEach((element) => {if (category === element) return true;});
    return false;
};

const errorMessages = ['Please stop; you\'re killing me.', 'Error with your input!', 'What the hell are you doing?'
    ];

let randomErrorMessage = function() {
    let index = Math.floor(Math.random() * errorMessages.length);
    return errorMessages[index];
};

let findRole = function(role) {
    let roles = client.guilds.array()[0].roles.array();
    roles.forEach((element) => {
        if (element.name === roleMap[role])
            return element.id;
    });
    console.log('Error: role not found');
    return null;
};