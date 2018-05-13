// Imports
const Discord = require('discord.js');
const firebase = require('firebase');
const fs = require('fs');

const client = new Discord.Client({autoReconnect:true});

// Config
const {
  prefix, firebasetoken, discordtoken, dbpass,
} = require('./config.json');

// Database
const database = firebase.initializeApp({
  apiKey: firebasetoken,
  authDomain: 'jeeves-7facd.firebaseapp.com',
  databaseURL: 'https://jeeves-7facd.firebaseio.com/',
});

// Constants
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
  'game-dev': 'Video Game Development',
};

// Helpers
const errorMessages =
  ['Please stop; you\'re killing me. ',
    'Error with your input! ',
    'What the hell are you doing? ',
  ];

function randomErrorMessage() {
  const index = Math.floor(Math.random() * errorMessages.length);
  return errorMessages[index];
}

// Listeners
client.on('ready', () => {
  database.auth().signInWithEmailAndPassword('jeeves@jeeves.com', dbpass).catch(((error) => {
    console.log(error.message);
  }));
  console.log(`logged in as ${client.user.tag}!`);
});

client.on('message', (msg) => {
  if (!msg.content.startsWith(prefix) || msg.author.bot) return;

  console.log(`Processing: "${msg}" from ${msg.author.username}`);

  const args = msg.content.slice(prefix.length).split(/ +/);
  const cmd = args.shift().toLowerCase();

  if (!client.commands.has(cmd)) {
    msg.reply(`${randomErrorMessage()} That's not a command!`);
  } else {
    try {
      client.commands.get(cmd).execute(msg, args);
    } catch (error) {
      console.error(`${msg.author.username} triggered a command_exec_error: ${error}`);
      msg.author.send(randomErrorMessage() + error);
    }
  }
});

// Helpers

function validCategory(category) {
  console.log(`validating category: ${category}`);
  if (category.toLowerCase() === 'moderator') {
    console.log('This fucker just tried to add a moderator project');
    return null;
  }
  for (let i = 0; i < categories.length; i += 1) {
    const element = categories[i];
    if (category.toLowerCase() === element.toLowerCase()) {
      return element;
    }
  }
  return null;
}

function getUserPath(user) {
  return `users/${user}`;
}

function getCategoryPath(userPath, category) {
  return `${userPath}/${category}`;
}

function getProjectPath(categoryPath, projectName) {
  return `${categoryPath}/${projectName}`;
}


function findRole(role) {
  const roles = client.guilds.array()[0].roles.array();
  let found = null;
  roles.forEach((element) => {
    if (element.name === roleMap[role]) {
      found = element;
    }
  });
  if (found === null) {
    console.log('Error: role not found');
    return null;
  }
  return found;
}

module.exports = {
  prefix,
  database,
  findRole,
  getProjectPath,
  validCategory,
  getUserPath,
  getCategoryPath,
  categories,
};

// Commands
client.commands = new Discord.Collection();
const commandFiles = fs.readdirSync('./commands');
commandFiles.forEach((ele) => {
  const command = require(`./commands/${ele}`);

  client.commands.set(command.name, command);
});

client.login(discordtoken).catch((err) => { console.log(err.message); });