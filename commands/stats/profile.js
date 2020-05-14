const { Command } = require("discord.js-commando");
const { RichEmbed } = require("discord.js");
const request = require("request");
const emojiFlags = require('emoji-flags');

module.exports = class profile extends Command {
    constructor(client) {
        super(client, {
            name: "profile",
            group: "stats",
            memberName: "profile",
            description: "Gets players stats.",
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
        let keysmode = keymode == "--7k" ? 2 : 1;

        let url = "https://api.quavergame.com/v1/users/full/" + username.replace(/_/g, "%20");

        request.get(url, { json: true }, (error, response, body) => {

            if (!error && body.status == 200) {
                let name = username.replace(/%20/g, " ").replace(/_/g, " ");
                let keymodeObject = null;
                let keymodeString = "";

                switch (keysmode) {
                    case 1:
                        keymodeObject = body.user.keys4;
                        keymodeString = "4K";
                        break;
                    case 2:
                        keymodeObject = body.user.keys7;
                        keymodeString = "7K";
                    default:
                        break;
                }

                let stats = {
                    "**Overall Rating**": Math.round(keymodeObject.stats.overall_performance_rating * 100) / 100,
                    "**Ranked Score**": keymodeObject.stats.ranked_score,
                    "**Total Score**": keymodeObject.stats.total_score,
                    "**Accuracy**": Math.round(keymodeObject.stats.overall_accuracy * 100) / 100,
                    "**Play Count**": keymodeObject.stats.play_count,
                    "**Max Combo**": keymodeObject.stats.max_combo
                };

                let statisticsString = "";
                for (const key in stats)
                    statisticsString += `${key}: ${stats[key].toLocaleString()}\n`;

                let embed = new RichEmbed();

                if (body.user.info.avatar_url != "undefined")
                    embed.setThumbnail(body.user.info.avatar_url);
                else
                    embed.setThumbnail("https://i.imgur.com/mYYW5EO.png");

                embed.setColor(0x00B0F4);
                embed.setTitle("Global: #" + keymodeObject.globalRank);
                embed.setAuthor(`Stats for ${name} (${keymodeString})`);
                embed.setDescription(`${emojiFlags.countryCode(body.user.info.country).emoji} Country Rank: #` + keymodeObject.countryRank);
                embed.addField("Statistics", statisticsString.trim());
                embed.setTimestamp();
                embed.setFooter("https://quavergame.com");
                message.embed(embed); //.setURL(url)

            } else if (!error && body.status == 404) {

                let name = username.replace(/%20/g, " ");
                let embed = new RichEmbed()
                embed.setColor(0x00B0F4)
                embed.setAuthor("Stats for " + name)
                embed.setThumbnail("https://i.imgur.com/mYYW5EO.png")
                embed.setDescription("This user does not exist!")
                embed.addField("Statistics", "No data can be shown!")
                embed.setTimestamp()
                embed.setFooter("https://quavergame.com")
                message.channel.send(embed)

            } else {

                console.error("Unable to send message.");
                //console.error(response);
                console.error(error);

            }
        })
    }
};
