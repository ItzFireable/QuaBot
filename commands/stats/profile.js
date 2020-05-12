const { Command } = require('discord.js-commando');
const { RichEmbed } = require('discord.js');
const request = require('request');

module.exports = class profile extends Command {
	constructor(client) {
		super(client, {
			name: 'profile',
			group: 'stats',
			memberName: 'profile',
			description: 'Gets players stats',
      args: [
	            {
		              key: 'username',
		              prompt: 'What is players username?',
		              type: 'string',
              },
	            {
		              key: 'keymode',
		              prompt: 'What is this other useless thing?',
		              type: 'string',
                  default: '--4k',
	             },
          ]
		});
	}
  run(message, { username,keymode }) {
		var linkname = username.replace(/_/g, '%20');
		var keysmode = 1
		if (keymode == "--7k") {
			var keysmode = 2
		} else {
			var keysmode = 1
		}
    request.get("https://api.quavergame.com/v1/users/full/" + linkname, {json:true}, (error, response, body) => {
      if (!error && body.status == 200) {
				var name = username.replace(/%20/g, ' ');
				name = username.replace(/_/g, ' ');
				let embed = new RichEmbed()
		    embed.setColor(0x44e8ff)
				if (keysmode == 1) {
					embed.setTitle("Global: #" + body.user.keys4.globalRank)
					embed.setAuthor("Stats for " + name + " (4K)")
					if (body.user.info.avatar_url != 'undefined') {
						embed.setThumbnail(body.user.info.avatar_url)
					} else {
						embed.setThumbnail('https://i.imgur.com/mYYW5EO.png')
					}
			    embed.setDescription("Country Ranking: #" + body.user.keys4.countryRank)
			    embed.addField("Statistics",'Overall Rating: ' + Math.round(body.user.keys4.stats.overall_performance_rating * 100) / 100 + '\nRanked Score: ' + body.user.keys4.stats.ranked_score.toLocaleString() + '\nTotal Score: ' + body.user.keys4.stats.total_score.toLocaleString() + '\nAccuracy: ' + Math.round(body.user.keys4.stats.overall_accuracy * 100) / 100 + '\nPlay Count: ' + body.user.keys4.stats.play_count.toLocaleString() + '\nMax Combo: ' + body.user.keys4.stats.max_combo.toLocaleString())
			    embed.setTimestamp()
			    embed.setFooter('https://quavergame.com')
					message.embed(embed)
				} else if (keysmode == 2) {
					embed.setTitle("Global: #" + body.user.keys7.globalRank)
					embed.setAuthor("Stats for " + name + " (7K)")
					if (body.user.info.avatar_url != 'undefined') {
						embed.setThumbnail(body.user.info.avatar_url)
					} else {
						embed.setThumbnail('https://i.imgur.com/mYYW5EO.png')
					}
			    embed.setDescription("Country Ranking: #" + body.user.keys7.countryRank)
			    embed.addField("Statistics",'Overall Rating: ' + Math.round(body.user.keys7.stats.overall_performance_rating * 100) / 100 + '\nRanked Score: ' + body.user.keys7.stats.ranked_score.toLocaleString() + '\nTotal Score: ' + body.user.keys7.stats.total_score.toLocaleString() + '\nAccuracy: ' + Math.round(body.user.keys7.stats.overall_accuracy * 100) / 100 + '\nPlay Count: ' + body.user.keys7.stats.play_count.toLocaleString() + '\nMax Combo: ' + body.user.keys7.stats.max_combo.toLocaleString())
			    embed.setTimestamp()
			    embed.setFooter('https://quavergame.com')
					message.embed(embed)
				}
		    //.setURL(url)
      } else if (!error && body.status == 404) {
				var name = username.replace(/%20/g, ' ');
				let embed = new RichEmbed()
				embed.setColor(0x44e8ff)
				embed.setAuthor("Stats for " + name)
				embed.setThumbnail('https://i.imgur.com/mYYW5EO.png')
				embed.setDescription("This user does not exist!")
				embed.addField("Statistics","No data can be shown!")
				embed.setTimestamp()
				embed.setFooter('https://quavergame.com')
				message.channel.send(embed)
      } else {
       console.error("Unable to send message.")
       console.error(response)
       console.error(error)
      }
    })
	}
};
