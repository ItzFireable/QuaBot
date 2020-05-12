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

        let keysmode = keymode == "--7k" ? 2 : 1;
        let name = username.replace(/%20/g, " ");
        let url = "https://api.quavergame.com/v1/users/full/" + name;

        request.get(url, { json: true }, (error, response, body) => {

            if (!error && body.status == 200) {
                
                let embed = new RichEmbed()

                embed.setColor(0x44e8ff)
                embed.setAuthor("Recent score for " + name)

                let id = body.user.info.id;
                let latest = "https://api.quavergame.com/v1/users/scores/recent?id=" + id + "&mode=" + keysmode + "&limit=1";

                request.get(latest, { json: true }, (error1, response1, body1) => {

                    if (!error1 && body1.status == 200) {


                        let stats = {
                            "**Rating**": Math.round(body1.scores[0].performance_rating * 100) / 100,
                            "**Score**": body1.scores[0].total_score,
                            "**Max Combo**": body1.scores[0].max_combo,
                            "**Mods**":body1.scores[0].mods_string,
                            "**Grade**": body1.scores[0].grade,
                            "**Accuracy**": Math.round(body1.scores[0].accuracy * 100) / 100,
                            "**Ratio**": Math.round(body1.scores[0].ratio * 10) / 10 + ":1"
                        };
        
                        let statisticsString = "";
                        for (const key in stats)
                            statisticsString += `${key}: ${stats[key].toLocaleString()}\n`;
        
                        embed.addField("Statistics", statisticsString.trim());

                        let bannerURL = `https://quaver.blob.core.windows.net/banners/${body1.scores[0].map.mapset_id}_banner.jpg`;
                        embed.setThumbnail(bannerURL)

                        embed.setTitle(`${body1.scores[0].map.artist} - ${body1.scores[0].map.title} (${body1.scores[0].map.difficulty_name})`)
                        embed.setDescription("Mapped by " + body1.scores[0].map.creator_username)
                        embed.setTimestamp()
                        embed.setFooter("https://quavergame.com")
                        message.channel.send(embed)

                    } else if (!error && body1.status == 200) {

                        let embed = new RichEmbed()
                        embed.setColor(0x44e8ff)
                        embed.setAuthor("Recent score for " + name)
                        embed.setThumbnail("https://i.imgur.com/mYYW5EO.png")
                        embed.setDescription("An error occurred getting the score.")
                        embed.addField("Statistics", "No data can be shown!")
                        embed.setTimestamp()
                        embed.setFooter("https://quavergame.com")

                        message.channel.send(embed)
                    } else {

                        console.error("Unable to send message.");
                        console.error(response1);
                        console.error(error1);

                    }
                })

            } else if (!error && body.status == 200) {

                let embed = new RichEmbed()
                embed.setColor(0x44e8ff)
                embed.setAuthor("Recent score for " + name)
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