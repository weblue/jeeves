const Discord = require('discord.js');
const client = new Discord.Client();
const firebase = require('firebase');

const database = firebase.initializeApp({
    apiKey: "AIzaSyDjmBGDSf92A10zLJBtZt-wOX_EbTr79Us",
    authDomain: "jeeves-7facd.firebaseapp.com",
    databaseURL: "https://jeeves-7facd.firebaseio.com/"
});

const prefix = '!';
const categories = [];

client.on('ready', () => {
    database.auth().signInWithEmailAndPassword("jeeves@jeeves.com", "jeeves12").catch((error => {console.log(error.message)}));
    console.log(`logged in as ${client.user.tag}!`);
});

client.on('message', msg => {
    if (msg.content.startsWith(`${prefix}`)) {
        let strings = msg.content.split(' ');

        switch(strings[0]) {
            case `${prefix}ping`:
                msg.reply('pong');
                break;
            case `${prefix}add`:
                //TODO param count checks and category validation
                database.database().ref(`users/${msg.author.id}/${strings[1]}`).set({
                    name: strings[2],
                    url: strings [3]
                });
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
        }
    }
    //insertion for commands is here
});

client.login('NDI5NzIwNjY2OTA5MDQ4ODMy.DaFwig.JkuqQ-J8KROY1hkLJUZWaK-3Qak');

//Helpers