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
    client.user.setPresence({
        game: {
            name: 'Quaver',
            type: "STREAMING",
            url: "https://quavergame.com"
        }
    });
});

client.on('error', console.error);

client.login(process.env.BOT_TOKEN);
