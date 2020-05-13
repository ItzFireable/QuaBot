const { Command } = require("discord.js-commando");
const { RichEmbed,MessageAttachment } = require("discord.js");
const emojiFlags = require('emoji-flags');
const request = require("request");
const moment = require('moment');
const Jimp = require('jimp');
const fs = require('fs');

module.exports = class topscores extends Command {
    constructor(client) {
        super(client, {
            name: "topscores",
            group: "stats",
            memberName: "topscores",
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
                embed.setColor(0x00B0F4)

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

                    if (!error1 && body1.status == 200 && body1.scores[0] != undefined) {

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

                        let Xrank = "<:gradex:710045519975809084>";
                        let SSrank = "<:gradess:710045511729807420>";
                        let Srank = "<:grades:710045503915819039>";
                        let Arank = "<:gradea:710045442968256582>";
                        let Brank = "<:gradeb:710045471095128126>";
                        let Crank = "<:gradec:710045478271844352>";
                        let Drank = "<:graded:710045488547889202>";
                        let Frank = "<:gradef:710045497288687696>";

                        for(let i = 0; i < body1.scores.length; i++) {

                            if (body1.scores[i].mods_string == "") {
                                body1.scores[i].mods_string == "Nomod"
                            }

                            let obj = body1.scores[i];
                            let date = new Date(body1.scores[i].time);
                            let since = moment(date).fromNow();

                            let stats = {
                                "": `**[${body1.scores[i].map.title} (${body1.scores[i].map.difficulty_name})](https://quavergame.com/mapsets/map/${body1.scores[i].map.id})** +**${body1.scores[i].mods_string}**`,
                                "**Score ▸ **": `${body1.scores[i].grade + "rank"} **${Math.round(body1.scores[i].accuracy * 100) / 100}**% | **${Math.round(body1.scores[i].performance_rating * 100) / 100}** QR`,
                                "**Info ▸ **": `${body1.scores[i].total_score} - x${body1.scores[i].max_combo} - [${body1.scores[i].count_marv}/${body1.scores[i].count_perf}/${body1.scores[i].count_great}/${body1.scores[i].count_good}/${body1.scores[i].count_okay}/${body1.scores[i].count_miss}]`,
                                "**Set ▸ **": `${since}`,
                            };

                            let statisticsString = "";
                            for (const key in stats)
                                statisticsString += `${key} ${stats[key].toLocaleString()}\n`;
                                statisticsString = statisticsString.replace("Xrank",Xrank);
                                statisticsString = statisticsString.replace("SSrank",SSrank);
                                statisticsString = statisticsString.replace("Srank",Srank);
                                statisticsString = statisticsString.replace("Arank",Arank);
                                statisticsString = statisticsString.replace("Brank",Brank);
                                statisticsString = statisticsString.replace("Crank",Crank);
                                statisticsString = statisticsString.replace("Drank",Drank);
                                statisticsString = statisticsString.replace("Frank",Frank);

                                embed.addField(`#${i+1}`, statisticsString.trim());

                        }

                        //embed.setTitle("Global Rank: #" + keymodeObject.globalRank);
                        embed.setTitle(`${emojiFlags.countryCode(body.user.info.country).emoji}  ${name}'s top scores (${keymodeString})`);
                        embed.setURL(`https://quavergame.com/profile/${body.user.info.id}?mode=${keysmode}`);
                        //embed.setDescription(`${emojiFlags.countryCode(body.user.info.country).emoji} Country Rank: #` + keymodeObject.countryRank);
                        embed.setTimestamp()
                        //embed.setThumbnail(`https://quaver.blob.core.windows.net/banners/${mapsetID}_banner.jpg`)
                        embed.setFooter("https://quavergame.com")

                        if (body.user.info.avatar_url != "undefined")
                            embed.setThumbnail(body.user.info.avatar_url);
                        else
                            embed.setThumbnail("https://i.imgur.com/mYYW5EO.png");

                        message.channel.send(embed)

                    } else if (!error1 && body1.status == 200 && body1.scores[0] == undefined) {

                        let embed = new RichEmbed()
                        embed.setColor(0x00B0F4)
                        embed.setAuthor("Top plays for " + name)
                        embed.setThumbnail("https://i.imgur.com/mYYW5EO.png")
                        embed.setDescription("No top plays!")
                        embed.addField("Statistics", "No data can be shown!")
                        embed.setTimestamp()
                        embed.setFooter("https://quavergame.com")

                        message.channel.send(embed)

                    } else if (!error && body1.status == 404) {

                        let embed = new RichEmbed()
                        embed.setColor(0x00B0F4)
                        embed.setAuthor("Top plays for " + name)
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
                embed.setAuthor("Top plays for " + name)
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