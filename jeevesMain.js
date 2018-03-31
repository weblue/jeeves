const Discord = require('discord.js');
const client = new Discord.Client();

import * as firebase from 'firebase';
const database = firebase.initializeApp({
    apiKey: "AIzaSyDjmBGDSf92A10zLJBtZt-wOX_EbTr79Us",
    authDomain: "jeeves-7facd.firebaseapp.com",
    databaseURL: "https://jeeves-7facd.firebaseio.com/"
});

const prefix = '!';

client.on('ready', () => {
    console.log(`logged in as ${client.user.tag}!`);
});

client.on('message', msg => {
    if (msg.content === `${prefix}ping`) {
        msg.reply('pong')
    }

    //insertion for commands is here
});

client.login('NDI5NzIwNjY2OTA5MDQ4ODMy.DaFwig.JkuqQ-J8KROY1hkLJUZWaK-3Qak');