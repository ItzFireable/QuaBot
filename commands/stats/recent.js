const { Command } = require("discord.js-commando");
const { RichEmbed } = require("discord.js");
const request = require("request");

module.exports = class recent extends Command {
    constructor(client) {
        super(client, {
            name: "recent",
            group: "stats",
            memberName: "recent",
            description: "Gets players most recent play",
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

                let id = body.user.info.id;
                let recenturl = "https://api.quavergame.com/v1/users/scores/recent?id=" + id + "&mode=" + keysmode + "&limit=1";
                
                let embed = new RichEmbed();

                embed.setAuthor(`Most recent play for ${name} (${keymodeString})`);
                if (body.user.info.avatar_url != "undefined")
                    embed.setThumbnail(body.user.info.avatar_url);
                else
                    embed.setThumbnail("https://i.imgur.com/mYYW5EO.png");
                
                embed.setColor(0x44e8ff);
                embed.setTimestamp();
                embed.setFooter("https://quavergame.com");

                request.get(url, { json: true }, (error, response, body) => {
                    if (!error && body.status == 200) {

                        let stats = {
                            "Rating": Math.round(body.scores[0].performance_rating * 100) / 100,
                            "Score": body.scores[0].total_score,
                            "Grade": body.scores[0].grade,
                            "Accuracy": Math.round(body.scores[0].accuracy * 100) / 100,
                            "Ratio": Math.round(body.scores[0].ratio * 10) / 10 + ":1",
                            "Combo": body.scores[0].max_combo
                        };

                        embed.setTitle(body.scores[0].artist + " - " + body.scores[0].title);
                        embed.addField("Statistics", statisticsString.trim());
                        message.channel.send(embed)

                    } else if (!error && body.status == 404) {

                        let embed = new RichEmbed()
                        embed.setColor(0x44e8ff)
                        embed.setAuthor("Could not load score!")
                        embed.setThumbnail("https://i.imgur.com/mYYW5EO.png")
                        embed.setDescription("Error loading score.")
                        embed.addField("Statistics", "No data can be shown!")
                        embed.setTimestamp()
                        embed.setFooter("https://quavergame.com")
                        message.channel.send(embed)

                    } else {

                        console.error("Unable to send message.");
                        console.error(response);
                        console.error(error);

                    }
                })

            } else if (!error && body.status == 404) {

                let name = username.replace(/%20/g, " ");
                let embed = new RichEmbed()
                embed.setColor(0x44e8ff)
                embed.setAuthor("Stats for " + name)
                embed.setThumbnail("https://i.imgur.com/mYYW5EO.png")
                embed.setDescription("This user does not exist!")
                embed.addField("Statistics", "No data can be shown!")
                embed.setTimestamp()
                embed.setFooter("https://quavergame.com")
                message.channel.send(embed)

            } else {

                console.error("Unable to send message.");
                console.error(response);
                console.error(error);

            }
        })
    }
}