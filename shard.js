const Discord = require('discord.js');
const { CommandoClient } = require('discord.js-commando');
const request = require('request');
const path = require('path');
const linkify = require('linkifyjs');

const client = new CommandoClient({
    commandPrefix: ';',
    owner: '329152844261490689',
    unknownCommandResponse: false,
});

client.registry
    //.registerDefaults()
    .registerDefaultTypes()
    .registerDefaultGroups()
    .registerDefaultCommands()
    .registerGroups([
        ['stats', 'Quaver Stats'],
        ['faq', 'Quaver FAQ']
    ])
    .registerCommandsIn(path.join(__dirname, 'commands'));

client.once('ready', () => {
    console.log(`Logged in as ${client.user.tag}! (${client.user.id})`);
    client.user.setPresence({
        game: {
            name: `on ${client.guilds.size} servers`,
            type: 'WATCHING'
        },
        status: 'online'
    })
});

function millisToMinutesAndSeconds(millis) {
    var minutes = Math.floor(millis / 60000);
    var seconds = ((millis % 60000) / 1000).toFixed(0);
    return minutes + ":" + (seconds < 10 ? '0' : '') + seconds;
  }


client.on('message', (message) => {

    if (message.content.includes('https://quavergame.com/mapset/map/')) {

        let link = linkify.find(message.content);
        let id = link[0].value.match(/\d+/)[0];

        let url = "https://api.quavergame.com/v1/maps/" + id

        request.get(url, { json: true }, (error, response, body) => {

            let status = "";

            switch (body.map.ranked_status) {
                case 1:
                    status = "Unranked";
                    break;
                case 2:
                    status = "Ranked";
                default:
                    break;
            }

            if (!error && body.status == 200) {

                let embed = new Discord.RichEmbed()
                embed.setColor(0x00B0F4)
                embed.setTitle(`**${body.map.title}**`)
                embed.setAuthor(status)
                embed.setDescription(`by ${body.map.creator_username}`)
                embed.setURL(`https://quavergame.com/mapset/map/${body.map.id}`)
                embed.addField("Difficulty", "Insert generic placeholder here!")
                embed.setTimestamp()
                embed.setImage(`https://quaver.blob.core.windows.net/banners/${body.map.mapset_id}_banner.jpg`)
                embed.setFooter("https://quavergame.com")
                message.channel.send(embed)

            } else if (!error && body.status == 404) {

                let embed = new Discord.RichEmbed()
                embed.setColor(0x00B0F4)
                embed.setTitle("Map Title")
                embed.setAuthor("Status")
                embed.setDescription("By Player Name")
                embed.addField("Difficulty", "Insert generic placeholder here!")
                embed.setTimestamp()
                embed.setFooter("https://quavergame.com")
                message.channel.send(embed)

            } else {

                console.error("Unable to send message.");
                console.error(error);

            }
        })
    } else if (message.content.includes('https://quavergame.com/mapset/')) {

        let link = linkify.find(message.content);
        let id = link[0].value.match(/\d+/)[0];

        let url = "https://api.quavergame.com/v1/mapsets/" + id

        request.get(url, { json: true }, (error, response, body) => {

            let status = "";

            switch (body.mapset.maps[0].ranked_status) {
                case 1:
                    status = "Unranked";
                    break;
                case 2:
                    status = "Ranked";
                default:
                    break;
            }



            if (!error && body.status == 200) {

                let embed = new Discord.RichEmbed()

                let keymodeString = "";

                switch (body.mapset.maps[0].game_mode) {
                    case 1:
                        keymodeString = "4K";
                        break;
                    case 2:
                        keymodeString = "7K";
                    default:
                        break;
                }

                let stats = {};
                for(let i = 0; i < body.mapset.maps.length; i++) {
                    stats[i] = `**- ${body.mapset.maps[i].difficulty_name}** [**${Math.round(body.mapset.maps[i].difficulty_rating * 100) / 100}** QR]`;
                }

                    //let stats = {
                    //    "": `**${body.mapset.maps[i].difficulty_name}** (${keymodeString})`,
                    //    "**Difficulty**: ": `${Math.round(body.mapset.maps[i].difficulty_rating * 100) / 100} qr | **Max Combo**: ${body.mapset.maps[i].count_hitobject_normal + (body.mapset.maps[i].count_hitobject_long * 2)}`,
                    //    "**Length**:" : `${millisToMinutesAndSeconds(body.mapset.maps[i].length)} | **BPM**: ${body.mapset.maps[i].bpm} | [Link](${"https://quavergame.com/mapsets/map/" + body.mapset.maps[i].id})`};

                let statisticsString = "";
                for (const key in stats)
                    statisticsString += `${stats[key].toLocaleString()}\n`;

                embed.addField(`Difficulties`, statisticsString.trim());

                embed.setDescription(`${status} | Mapped by ${body.mapset.creator_username}\n${keymodeString} | **${body.mapset.maps[0].bpm}** BPM | Duration: **${millisToMinutesAndSeconds(body.mapset.maps[0].length)}**`)

                embed.setColor(0x00B0F4)
                embed.setTitle(`**${body.mapset.artist} - ${body.mapset.title}**`)
                embed.setURL(`https://quavergame.com/mapset/map/${body.mapset.maps[0].id}`)
                embed.setTimestamp()
                embed.setImage(`https://quaver.blob.core.windows.net/banners/${body.mapset.id}_banner.jpg`)
                embed.setFooter("https://quavergame.com")
                message.channel.send(embed)

            } else if (!error && body.status == 404) {

                let embed = new Discord.RichEmbed()
                embed.setColor(0x00B0F4)
                embed.setTitle("Map Title")
                embed.setAuthor("Status")
                embed.setDescription("by Player Name")
                embed.addField("Difficulties", "Insert generic placeholder here!")
                embed.setTimestamp()
                embed.setFooter("https://quavergame.com")
                message.channel.send(embed)

            } else {

                console.error("Unable to send message.");
                console.error(error);

            }
        })
    }
});

client.on('error', console.error);

client.login(process.env.BOT_TOKEN);
