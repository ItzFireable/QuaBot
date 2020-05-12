const { Command } = require("discord.js-commando");
const { RichEmbed,MessageAttachment } = require("discord.js");
const request = require("request");
const moment = require('moment');
const Jimp = require('jimp');
const fs = require('fs');

module.exports = class topplays extends Command {
    constructor(client) {
        super(client, {
            name: "topplays",
            group: "stats",
            memberName: "topplays",
            description: "Gets players top 5 plays.",
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
                let latest = "https://api.quavergame.com/v1/users/scores/best?id=" + id + "&mode=" + keysmode + "&limit=5";

                request.get(latest, { json: true }, (error1, response1, body1) => {

                    if (!error1 && body1.status == 200) {

                        let mapsetID = body1.scores[0].map.mapset_id;
                        //let attachment = new MessageAttachment("../../cache/banners/",`${mapsetID}.jpg`);

                        //if (fs.existsSync(`../../cache/banners/${mapsetID}.jpg`)) {

                        //    let image = `../../cache/banners/${mapsetID}.jpg`;
                        //    embed.setThumbnail(`attachment://${mapsetID}.jpg`)

                        //} else {

                        //    let bannerURL = `https://quaver.blob.core.windows.net/banners/${mapsetID}_banner.jpg`;
                        //    Jimp.read(bannerURL, (err, image) => {
                        //        if (err) throw err;
                        //        image
                        //            .crop(0,0,450,250)
                        //            .write(`../../cache/banners/${mapsetID}.jpg`);
                        //    });

                        //    let image = `../../cache/banners/${mapsetID}.jpg`;
                        //    embed.setThumbnail(`attachment://${mapsetID}.jpg`)
                        //}

                        let date = new Date(body1.scores[0].time);
                        let since = moment(date).fromNow()

                        let stats = {
                            "**1.**": `${body1.scores[0].map.artist} - ${body1.scores[0].map.title} (${body1.scores[0].map.difficulty_name}) - ${Math.round(body1.scores[0].accuracy * 100) / 100} / ${Math.round(body1.scores[0].performance_rating * 100) / 100} QP`,
                            "**2.**": `${body1.scores[1].map.artist} - ${body1.scores[1].map.title} (${body1.scores[1].map.difficulty_name}) - ${Math.round(body1.scores[1].accuracy * 100) / 100} / ${Math.round(body1.scores[1].performance_rating * 100) / 100} QP`,
                            "**3.**": `${body1.scores[2].map.artist} - ${body1.scores[2].map.title} (${body1.scores[2].map.difficulty_name}) - ${Math.round(body1.scores[2].accuracy * 100) / 100} / ${Math.round(body1.scores[2].performance_rating * 100) / 100} QP`,
                            "**4.**": `${body1.scores[3].map.artist} - ${body1.scores[3].map.title} (${body1.scores[3].map.difficulty_name}) - ${Math.round(body1.scores[3].accuracy * 100) / 100} / ${Math.round(body1.scores[3].performance_rating * 100) / 100} QP`,
                            "**5.**": `${body1.scores[4].map.artist} - ${body1.scores[4].map.title} (${body1.scores[4].map.difficulty_name}) - ${Math.round(body1.scores[4].accuracy * 100) / 100} / ${Math.round(body1.scores[4].performance_rating * 100) / 100} QP`,
                        };
        
                        let statisticsString = "";
                        for (const key in stats)
                            statisticsString += `${key}: ${stats[key].toLocaleString()}\n`;
        
                        embed.addField("Top Plays", statisticsString.trim());

                        embed.setTitle("Global: #" + keymodeObject.globalRank);
                        embed.setAuthor(`Top plays for ${name} (${keymodeString})`);
                        embed.setDescription("Country Ranking: #" + keymodeObject.countryRank);
                        embed.setTimestamp()
                        embed.setThumbnail(`https://quaver.blob.core.windows.net/banners/${mapsetID}_banner.jpg`)
                        embed.setFooter("https://quavergame.com")
                        message.channel.send(embed)

                    } else if (!error && body1.status == 200) {

                        let embed = new RichEmbed()
                        embed.setColor(0x44e8ff)
                        embed.setAuthor("Top plays for " + name)
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
                embed.setAuthor("Top plays for " + name)
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