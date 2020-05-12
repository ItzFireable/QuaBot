const { Command } = require("discord.js-commando");
const { RichEmbed,MessageAttachment,Emoji } = require("discord.js");
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

                        let date1 = new Date(body1.scores[0].time);
                        let since1 = moment(date1).fromNow()
                        
                        let Xrank = Emoji("585556037319524352");
                        let SSrank = Emoji("585555983921709087");
                        let Srank = Emoji("585555950623260673");
                        let Arank = Emoji("585555734205562880");
                        let Brank = Emoji("585555793248780288");
                        let Crank = Emoji("585555833564299284");
                        let Drank = Emoji("585555873951383554");
                        let Frank = Emoji("585555916292751390");

                        let stats1 = {
                            "** **": `**${body1.scores[0].map.artist} - ${body1.scores[0].map.title} (${body1.scores[0].map.difficulty_name})**`,
                            "** Score▸ **": `${body1.scores[0].grade + "rank"} ${Math.round(body1.scores[0].accuracy * 100) / 100}% / ${Math.round(body1.scores[0].performance_rating * 100) / 100} QP`,
                            "** Info ▸ **": `${body1.scores[0].total_score} - x${body1.scores[0].max_combo} - [${body1.scores[0].count_marv}/${body1.scores[0].count_perf}/${body1.scores[0].count_great}/${body1.scores[0].count_good}/${body1.scores[0].count_okay}/${body1.scores[0].count_miss}]`,
                            "** Score set ▸ **": `${since1}`,
                        };

                        let date2 = new Date(body1.scores[1].time);
                        let since2 = moment(date2).fromNow()

                        let stats2 = {
                            "** **": `**${body1.scores[1].map.artist} - ${body1.scores[1].map.title} (${body1.scores[1].map.difficulty_name})**`,
                            "** Score ▸ **": `${body1.scores[1].grade + "rank"} ${Math.round(body1.scores[1].accuracy * 100) / 100}% / ${Math.round(body1.scores[1].performance_rating * 100) / 100} QP`,
                            "** Info ▸ **": `${body1.scores[1].total_score} - x${body1.scores[1].max_combo} - [${body1.scores[1].count_marv}/${body1.scores[1].count_perf}/${body1.scores[1].count_great}/${body1.scores[1].count_good}/${body1.scores[1].count_okay}/${body1.scores[1].count_miss}]`,
                            "** Score set ▸ **": `${since2}`,
                        };

                        let date3 = new Date(body1.scores[2].time);
                        let since3 = moment(date3).fromNow()

                        let stats3 = {
                            "** **": `**${body1.scores[2].map.artist} - ${body1.scores[2].map.title} (${body1.scores[2].map.difficulty_name})**`,
                            "** Score ▸ **": `${body1.scores[2].grade + "rank"} ${Math.round(body1.scores[2].accuracy * 100) / 100}% / ${Math.round(body1.scores[2].performance_rating * 100) / 100} QP`,
                            "** Info ▸ **": `${body1.scores[2].total_score} - x${body1.scores[2].max_combo} - [${body1.scores[2].count_marv}/${body1.scores[2].count_perf}/${body1.scores[2].count_great}/${body1.scores[2].count_good}/${body1.scores[2].count_okay}/${body1.scores[2].count_miss}]`,
                            "** Score set ▸ **": `${since3}`,
                        };

                        let date4 = new Date(body1.scores[3].time);
                        let since4 = moment(date4).fromNow()

                        let stats4 = {
                            "** **": `**${body1.scores[3].map.artist} - ${body1.scores[3].map.title} (${body1.scores[3].map.difficulty_name})**`,
                            "** Score ▸ **": `${body1.scores[3].grade + "rank"} ${Math.round(body1.scores[3].accuracy * 100) / 100}% / ${Math.round(body1.scores[3].performance_rating * 100) / 100} QP`,
                            "** Info ▸ **": `${body1.scores[3].total_score} - x${body1.scores[3].max_combo} - [${body1.scores[3].count_marv}/${body1.scores[3].count_perf}/${body1.scores[3].count_great}/${body1.scores[3].count_good}/${body1.scores[3].count_okay}/${body1.scores[3].count_miss}]`,
                            "** Score set ▸ **": `${since4}`,
                        };

                        let date5 = new Date(body1.scores[4].time);
                        let since5 = moment(date5).fromNow()

                        let stats5 = {
                            "** **": `**${body1.scores[4].map.artist} - ${body1.scores[4].map.title} (${body1.scores[4].map.difficulty_name})**`,
                            "** Score ▸ **": `${body1.scores[4].grade + "rank"} ${Math.round(body1.scores[4].accuracy * 100) / 100}% / ${Math.round(body1.scores[4].performance_rating * 100) / 100} QP`,
                            "** Info ▸ **": `${body1.scores[4].total_score} - x${body1.scores[4].max_combo} - [${body1.scores[4].count_marv}/${body1.scores[4].count_perf}/${body1.scores[4].count_great}/${body1.scores[4].count_good}/${body1.scores[4].count_okay}/${body1.scores[4].count_miss}]`,
                            "** Score set ▸ **": `${since5}`,
                        };
        
                        let statisticsString1 = "";
                        for (const key in stats1)
                            statisticsString1 += `${key} ${stats1[key].toLocaleString()}\n`;
                            statisticsString1 = statisticsString1.replace("Xrank",Xrank);
                            statisticsString1 = statisticsString1.replace("SSrank",SSrank);
                            statisticsString1 = statisticsString1.replace("Srank",Srank);
                            statisticsString1 = statisticsString1.replace("Arank",Arank);
                            statisticsString1 = statisticsString1.replace("Brank",Brank);
                            statisticsString1 = statisticsString1.replace("Crank",Crank);
                            statisticsString1 = statisticsString1.replace("Drank",Drank);
                            statisticsString1 = statisticsString1.replace("Frank",Frank);
                        let statisticsString2 = "";
                        for (const key in stats2)
                            statisticsString2 += `${key} ${stats2[key].toLocaleString()}\n`;
                            statisticsString2 = statisticsString2.replace("Xrank",Xrank);
                            statisticsString2 = statisticsString2.replace("SSrank",SSrank);
                            statisticsString2 = statisticsString2.replace("Srank",Srank);
                            statisticsString2 = statisticsString2.replace("Arank",Arank);
                            statisticsString2 = statisticsString2.replace("Brank",Brank);
                            statisticsString2 = statisticsString2.replace("Crank",Crank);
                            statisticsString2 = statisticsString2.replace("Drank",Drank);
                            statisticsString2 = statisticsString2.replace("Frank",Frank);
                        let statisticsString3 = "";
                        for (const key in stats3)
                            statisticsString3 += `${key} ${stats3[key].toLocaleString()}\n`;
                            statisticsString3 = statisticsString3.replace("Xrank",Xrank);
                            statisticsString3 = statisticsString3.replace("SSrank",SSrank);
                            statisticsString3 = statisticsString3.replace("Srank",Srank);
                            statisticsString3 = statisticsString3.replace("Arank",Arank);
                            statisticsString3 = statisticsString3.replace("Brank",Brank);
                            statisticsString3 = statisticsString3.replace("Crank",Crank);
                            statisticsString3 = statisticsString3.replace("Drank",Drank);
                            statisticsString3 = statisticsString3.replace("Frank",Frank);
                        let statisticsString4 = "";
                        for (const key in stats4)
                            statisticsString4 += `${key} ${stats4[key].toLocaleString()}\n`;
                            statisticsString4 = statisticsString4.replace("Xrank",Xrank);
                            statisticsString4 = statisticsString4.replace("SSrank",SSrank);
                            statisticsString4 = statisticsString4.replace("Srank",Srank);
                            statisticsString4 = statisticsString4.replace("Arank",Arank);
                            statisticsString4 = statisticsString4.replace("Brank",Brank);
                            statisticsString4 = statisticsString4.replace("Crank",Crank);
                            statisticsString4 = statisticsString4.replace("Drank",Drank);
                            statisticsString4 = statisticsString4.replace("Frank",Frank);
                        let statisticsString5 = "";
                        for (const key in stats5)
                            statisticsString5 += `${key} ${stats5[key].toLocaleString()}\n`;
                            statisticsString5 = statisticsString5.replace("Xrank",Xrank);
                            statisticsString5 = statisticsString5.replace("SSrank",SSrank);
                            statisticsString5 = statisticsString5.replace("Srank",Srank);
                            statisticsString5 = statisticsString5.replace("Arank",Arank);
                            statisticsString5 = statisticsString5.replace("Brank",Brank);
                            statisticsString5 = statisticsString5.replace("Crank",Crank);
                            statisticsString5 = statisticsString5.replace("Drank",Drank);
                            statisticsString5 = statisticsString5.replace("Frank",Frank);
        
                        embed.addField("Play #1", statisticsString1.trim());
                        embed.addField("Play #2", statisticsString2.trim());
                        embed.addField("Play #3", statisticsString3.trim());
                        embed.addField("Play #4", statisticsString4.trim());
                        embed.addField("Play #5", statisticsString5.trim());

                        embed.setTitle("Global: #" + keymodeObject.globalRank);
                        embed.setAuthor(`Top plays for ${name} (${keymodeString})`);
                        embed.setDescription("Country Ranking: #" + keymodeObject.countryRank);
                        embed.setTimestamp()
                        //embed.setThumbnail(`https://quaver.blob.core.windows.net/banners/${mapsetID}_banner.jpg`)
                        embed.setFooter("https://quavergame.com")
                        message.channel.send(embed)

                    } else if (!error1 && body1.status == 200 && body1.scores[0] == undefined) {

                        let embed = new RichEmbed()
                        embed.setColor(0x44e8ff)
                        embed.setAuthor("Top plays for " + name)
                        embed.setThumbnail("https://i.imgur.com/mYYW5EO.png")
                        embed.setDescription("No top plays!")
                        embed.addField("Statistics", "No data can be shown!")
                        embed.setTimestamp()
                        embed.setFooter("https://quavergame.com")

                        message.channel.send(embed)

                    } else if (!error && body1.status == 404) {

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
                        //console.error(response1);
                        console.error(error1);

                    }
                })

            } else if (!error && body.status == 404) {

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
                //console.error(response);
                console.error(error);

            }
        })

    }
}