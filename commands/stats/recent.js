const { Command } = require("discord.js-commando");
const { RichEmbed, MessageAttachment } = require("discord.js");
const request = require("request");
const moment = require('moment');
const fs = require('fs');
const path = require('path');


module.exports = class recent extends Command {
    constructor(client) {
        super(client, {
            name: "recent",
            group: "stats",
            memberName: "recent",
            description: "Gets players most recent score.",
            args: [
                {
                    key: "name",
                    prompt: "What is players username?",
                    type: "string",
                    default: ""
                },
                {
                    key: "recentnum",
                    prompt: "Which recent score?",
                    type: "integer",
                    max: 50,
                    default: 1,
                },
                {
                    key: "keymode",
                    prompt: "What is this other useless thing?",
                    type: "string",
                    default: "",
                },
            ]
        });
    }
    run(message, { name, keymode, recentnum }) {

        let profiles = ""
        let username = name
        let keysmode = keymode == "--7k" ? 2 : 1;

        try {
            const jsonString = fs.readFileSync(path.join(__dirname, "/../../data/profiles.json"))
            profiles = JSON.parse(jsonString)
            if (username == "") {
                for (let i = 0; i < profiles['profiles'].length; i++) {
                    if (profiles['profiles'][i].id == message.author.id) {
                        username = profiles['profiles'][i].username
                        if (keymode == "") {
                            keysmode = Number(profiles['profiles'][i].keymode)
                        }
                        // console.log(`Username: ${profiles['profiles'][i].username}, id: ${profiles['profiles'][i].userid}`)
                    }
                }
            }
        } catch (err) {
            console.log(err)
            return
        }

        if (username == "") {
            return message.channel.send("No username specified!")
        }

        let url = "https://api.quavergame.com/v1/users/full/" + username;

        request.get(url, { json: true }, (error, response, body) => {

            if (!error && body.status == 200) {

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

                let embed = new RichEmbed()

                embed.setColor(0x00B0F4)
                embed.setAuthor(`Recent score for ${username} (${keymodeString})`)

                let id = body.user.info.id;
                let latest = "https://api.quavergame.com/v1/users/scores/recent?id=" + id + "&mode=" + keysmode + "&limit=" + recentnum;
                let num = recentnum - 1
                request.get(latest, { json: true }, (error1, response1, body1) => {

                    if (!error1 && body1.status == 200 && body1.scores[num] != undefined) {

                        let mapsetID = body1.scores[num].map.mapset_id;

                        let date = new Date(body1.scores[num].time);
                        let since = moment(date).fromNow()

                        let Xrank = "<:gradex:710045519975809084>";
                        let SSrank = "<:gradess:710045511729807420>";
                        let Srank = "<:grades:710045503915819039>";
                        let Arank = "<:gradea:710045442968256582>";
                        let Brank = "<:gradeb:710045471095128126>";
                        let Crank = "<:gradec:710045478271844352>";
                        let Drank = "<:graded:710045488547889202>";
                        let Frank = "<:gradef:710045497288687696>";

                        let stats = {
                            "**Score ▸ **": `${body1.scores[num].grade + "rank"} **${Math.round(body1.scores[num].accuracy * 100) / 100}**% | **${Math.round(body1.scores[num].performance_rating * 100) / 100}** qr`,
                            "**Info ▸ **": `${body1.scores[num].total_score} - x${body1.scores[num].max_combo} - [${body1.scores[num].count_marv}/${body1.scores[num].count_perf}/${body1.scores[num].count_great}/${body1.scores[num].count_good}/${body1.scores[num].count_okay}/${body1.scores[num].count_miss}]`,
                            "**Mods ▸ **": `**${body1.scores[num].mods_string}**`,
                            "**Set ▸ **": since
                        };

                        let statisticsString = "";
                        for (const key in stats)
                            statisticsString += `${key} ${stats[key].toLocaleString()}\n`;
                        statisticsString = statisticsString.replace("Xrank", Xrank);
                        statisticsString = statisticsString.replace("SSrank", SSrank);
                        statisticsString = statisticsString.replace("Srank", Srank);
                        statisticsString = statisticsString.replace("Arank", Arank);
                        statisticsString = statisticsString.replace("Brank", Brank);
                        statisticsString = statisticsString.replace("Crank", Crank);
                        statisticsString = statisticsString.replace("Drank", Drank);
                        statisticsString = statisticsString.replace("Frank", Frank);

                        embed.addField("Statistics", statisticsString.trim());
                        embed.setTitle(`**${body1.scores[num].map.title} (${body1.scores[num].map.difficulty_name})**`)
                        embed.setURL(`https://quavergame.com/mapset/map/${body1.scores[num].map.id}`)
                        embed.setDescription("Mapped by " + body1.scores[num].map.creator_username)
                        embed.setTimestamp()
                        embed.setThumbnail(`https://quaver.blob.core.windows.net/banners/${mapsetID}_banner.jpg`)
                        embed.setFooter("https://quavergame.com")
                        message.channel.send(embed)

                    } else if (!error1 && body1.status == 200 && body1.scores[num] == undefined) {

                        let embed = new RichEmbed()
                        embed.setColor(0x00B0F4)
                        embed.setAuthor(`${name}'s most recent score (${keymodeString})`)
                        embed.setThumbnail("https://i.imgur.com/mYYW5EO.png")
                        embed.setDescription("No recent plays!")
                        embed.addField("Statistics", "No data can be shown!")
                        embed.setTimestamp()
                        embed.setFooter("https://quavergame.com")
                        message.channel.send(embed)

                    } else if (!error && body1.status == 404) {

                        let embed = new RichEmbed()
                        embed.setColor(0x00B0F4)
                        embed.setAuthor(`${name}'s top scores (${keymodeString})`)
                        embed.setThumbnail("https://i.imgur.com/mYYW5EO.png")
                        embed.setDescription("An error occurred getting the score.")
                        embed.addField("Statistics", "No data can be shown!")
                        embed.setTimestamp()
                        embed.setFooter("https://quavergame.com")

                        message.channel.send(embed)
                    } else {

                        console.error("Unable to send message.");
                        //console.error(response1);
                        console.error(error1);

                    }
                })

            } else if (!error && body.status == 404) {

                let embed = new RichEmbed()
                embed.setColor(0x00B0F4)
                embed.setAuthor("Recent score for " + name)
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
}
