const { Command } = require("discord.js-commando");
const { RichEmbed } = require("discord.js");
const request = require("request");
const emojiFlags = require('emoji-flags');

module.exports = class compare extends Command {
    constructor(client) {
        super(client, {
            name: "compare",
            group: "stats",
            memberName: "compare",
            description: "Compare most recent score.",
            args: [
                {
                    key: "username",
                    prompt: "What is players username?",
                    type: "string",
                },
            ]
        });
    }
    run(message, { username }) {
        message.channel.send("Not implemented yet!");
    }
}