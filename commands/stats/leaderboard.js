const { Command } = require('discord.js-commando');
const Discord = require('discord.js');
const linkify = require('linkifyjs');
const request = require('request');
const path = require('path');
const emojiFlags = require('emoji-flags');
const moment = require('moment');
const fs = require('fs');
const { RichEmbed, MessageAttachment } = require("discord.js");

module.exports = class leaderboard extends Command {
	constructor(client) {
		super(client, {
			name: 'leaderboard',
			group: 'stats',
			memberName: 'leaderboard',
			description: 'Shows leaderboards for a map',
			args: [
				{
					key: "map link",
					prompt: "What is maps link?",
					type: "string",
				},
			]
		});
	}

	run(message) {

		let Xrank = "<:gradex:710045519975809084>";
		let SSrank = "<:gradess:710045511729807420>";
		let Srank = "<:grades:710045503915819039>";
		let Arank = "<:gradea:710045442968256582>";
		let Brank = "<:gradeb:710045471095128126>";
		let Crank = "<:gradec:710045478271844352>";
		let Drank = "<:graded:710045488547889202>";
		let Frank = "<:gradef:710045497288687696>";

		function millisToMinutesAndSeconds(millis) {
			var minutes = Math.floor(millis / 60000);
			var seconds = ((millis % 60000) / 1000).toFixed(0);
			return minutes + ":" + (seconds < 10 ? '0' : '') + seconds;
		}

		if (message.content.includes('https://quavergame.com/mapset/map/')) {

			let link = linkify.find(message.content);
			let id = link[0].value.match(/\d+/)[0];

			let url = "https://api.quavergame.com/v1/maps/" + id
			let url2 = "https://api.quavergame.com/v1/scores/map/" + id

			let embed = new RichEmbed()
			embed.setColor(0x00B0F4)

			request.get(url, { json: true }, (error, response, body) => {
				if (!error && body.status == 200 && body.map.ranked_status == 2) {
					request.get(url2, { json: true }, (error2, response2, body2) => {
						if (!error2 && body2.status == 200) {
							for (let i = 0; i < body2.scores.length && i < 5; i++) {

								if (body2.scores[i].mods_string == "") {
									body2.scores[i].mods_string == "Nomod"
								}
	
								let obj = body2.scores[i];
								let date = new Date(body2.scores[i].time);
								let since = moment(date).fromNow();
	
								let stats = {
									"": `**${body2.scores[i].user.username}**  + **${body2.scores[i].mods_string}**`,
									"**Score ▸ **": `${body2.scores[i].grade + "rank"} **${Math.round(body2.scores[i].accuracy * 100) / 100}**% | **${Math.round(body2.scores[i].performance_rating * 100) / 100}** qr`,
									"**Info ▸ **": `${body2.scores[i].total_score} - x${body2.scores[i].max_combo} - [${body2.scores[i].count_marv}/${body2.scores[i].count_perf}/${body2.scores[i].count_great}/${body2.scores[i].count_good}/${body2.scores[i].count_okay}/${body2.scores[i].count_miss}]`,
									"**Set ▸ **": `${since}`,
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
	
								embed.addField(`#${i + 1}`, statisticsString.trim());
	
							}

							let keymodeString = "";

							switch (body.map.game_mode) {
								case 1:
									keymodeString = "4K";
									break;
								case 2:
									keymodeString = "7K";
									break;
								default:
									break;
							}

							embed.setDescription(`Ranked | Mapped by ${body.map.creator_username}\n${keymodeString} | **${body.map.bpm}** BPM | Duration: **${millisToMinutesAndSeconds(body.map.length)}**`)
                    		embed.setTitle(`**${body.map.artist} - ${body.map.title}**`)
							embed.setTimestamp()
							embed.setURL(`https://quavergame.com/mapset/map/${body.map.id}`)
							embed.setThumbnail(`https://quaver.blob.core.windows.net/banners/${body.map.mapset_id}_banner.jpg`)
							embed.setFooter("https://quavergame.com")
							message.channel.send(embed)
						} else if (error2) {
							console.error(error2);
						}
					})
				} else if (error) {
					console.error(error);
				}
			})
		} else if (message.content.includes('https://quavergame.com/mapset/')) {

			let embed = new RichEmbed()
            embed.setColor(0x00B0F4)
            embed.setAuthor("Use /mapset/map link instead!")
            embed.setThumbnail("https://i.imgur.com/mYYW5EO.png")
            embed.setDescription("Cannot get the data from a full mapset.")
            embed.addField("Scores", "No data can be shown!")
            embed.setTimestamp()
            embed.setFooter("https://quavergame.com")
            message.channel.send(embed)
		}
	}
};