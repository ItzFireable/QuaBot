const { Command } = require("discord.js-commando");
const { RichEmbed } = require("discord.js");
const request = require("request");

module.exports = class recent extends Command {
    constructor(client) {
        super(client, {
            name: "recent",
            group: "stats",
            memberName: "recent",
            description: "Gets players most recent score.",
            args: [
                {
                    key: "username",
                    prompt: "What is players username?",
                    type: "string",
                },
                {
                    key: "keymode",
                    prompt: "What is this other useless thing?",
                    type: "string",
                    default: "--4k",
                },
            ]
        });
    }
    run(message, { username, keymode }) {
        let name = username.replace(/%20/g, " ");
        let embed = new RichEmbed()
        embed.setColor(0x44e8ff)
        embed.setAuthor("Recent score for " + name)
        embed.setThumbnail("https://i.imgur.com/mYYW5EO.png")
        embed.setDescription("Not implemented yet. Please try again later!")
        embed.addField("Statistics", "No data can be shown!")
        embed.setTimestamp()
        embed.setFooter("https://quavergame.com")
        message.channel.send(embed)
    }
}