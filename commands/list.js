const main = require('../jeevesMain');

module.exports = {
    name: 'list',
    description: 'Lists all projects by specified user or by message author',
    usage: `${main.prefix}list\n Lists all projects owned by the author. or\n 
            ${main.prefix}list @{author}\n Lists all projects owned by @'d user`,
    execute(msg) {
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
            return msg.reply(main.randomErrorMessage() + 'Incorrect usage: !list or !list {@member}');

        database.database()
            .ref(main.getUserPath(reqTarget))
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
    },
};
