const Discord = require('discord.js');
const { CommandoClient } = require('discord.js-commando');
const request = require('request');
const path = require('path');

const client = new CommandoClient({
    commandPrefix: ';',
    owner: '329152844261490689',
    unknownCommandResponse: false,
});

const activities_list = [
    "Quaver",
    "Quaver",
    "Quaver",
    "with JavaScript"
];

client.registry
    //.registerDefaults()
    .registerDefaultTypes()
    .registerDefaultGroups()
    .registerDefaultCommands()
    .registerGroups([
        ['stats', 'Quaver Stats'],
    ])
    .registerCommandsIn(path.join(__dirname, 'commands'));

client.once('ready', () => {
    console.log(`Logged in as ${client.user.tag}! (${client.user.id})`);
    setInterval(() => {
        // generates a random number between 1 and the length of the activities array list (in this case 5).
        const index = Math.floor(Math.random() * (activities_list.length - 1) + 1);
        // sets bots activities to one of the phrases in the arraylist.
        client.user.setActivity(activities_list[index], { type: 4 });
    }, 10000);
});

client.on('error', console.error);

client.login(process.env.BOT_TOKEN);
