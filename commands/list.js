const main = require('../jeevesMain');

module.exports = {
  name: 'list',
  description: 'Lists all projects by specified user or by message author',
  usage: `${main.prefix}list\nLists all projects owned by the author or\n${main.prefix}list @{member}\nLists all projects owned by @'d user`,
  execute(msg, args) {
    /** Ex. !list
     *    Lists all projects owned by the requester author.
     *
     * Ex. !list {author}
     *    Lists all the projects owned by the author.
     */
    let reqTarget;
    if (args.length === 0) {
        reqTarget = msg.author;
    } else if (msg.mentions.users.size === 1) {
        reqTarget = msg.mentions.users.first().id;
    } else {
        throw msg.reply(`Usage: ${this.usage}`);
    }

    main.database.database()
      .ref(main.getUserPath(reqTarget))
      .once('value')
      .then((snapshot) => {
        let replyString = '';
          if (!snapshot.exists()) {
              msg.author
                  .send(`${reqTarget.username} has no projects!`)
                  .then(message => console.log(`Sent message: ${message.content} to ${msg.author.username}`));
          } else {
              console.log(snapshot.val());
              snapshot.forEach((categorySnapshot) => {
                  const category = categorySnapshot.key;
                  replyString += `\t**${category}**\n`;
                  categorySnapshot.forEach((projSnapshot) => {
                      replyString += `\t\t*${projSnapshot.key}*: ${projSnapshot.val().url}\n`;
                  });
              });
              msg.author
                  .send(`${msg.mentions.users.first().username}'s projects:\n${replyString}`)
                  .then(message => console.log(`Sent message: ${message.content} to ${msg.author.username}`));
          }
      });
  },
};
