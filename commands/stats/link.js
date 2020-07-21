const { Command } = require("discord.js-commando");
const { RichEmbed, MessageAttachment } = require("discord.js");
const request = require("request");
const moment = require('moment');
const fs = require('fs');
const path = require('path');


module.exports = class link extends Command {
    constructor(client) {
        super(client, {
            name: "link",
            group: "stats",
            memberName: "link",
            description: "Links Discord to Quaver account.",
            args: [
                {
                    key: "name",
                    prompt: "What account would you like to be linked to?",
                    type: "string",
                },
                {
                    key: "keymode",
                    prompt: "Default keymode? (4k / 7k)",
                    type: "string",
                },
            ]
        });
    }
    run(message, { name, keymode }) {

        let profiles = ""
        let username = name
        let keysmode = keymode == "7k" ? "2" : "1";

        const profile = {
            "id": `${message.author.id}`,
            "username": name,
            "keymode": `${keysmode}`,
        }

        fs.readFile(path.join(__dirname, "/../../data/profiles.json"), 'utf8', function readFileCallback(err, data) {
            if (err) {

                console.log(err);

            } else {

                let obj = JSON.parse(data); //now it an object
                let exists = 0

                for (let i = 0; i < obj['profiles'].length; i++) {
                    if (obj['profiles'][i].id == message.author.id) {
                        obj['profiles'][i].username = name
                        obj['profiles'][i].keymode = keysmode
                        exists = 1
                    }
                }

                switch (exists) {
                    case 0:
                        obj.profiles.push(profile);
                        break;
                }

                let json = JSON.stringify(obj, undefined, 4); //convert it back to json

                fs.writeFile(path.join(__dirname, "/../../data/profiles.json"), json, 'utf8', err => {
                    if (err) {
                        console.log('Error writing file', err)
                        return message.channel.send(`Something went wrong while saving data. Try again later.`)
                    } else {
                        console.log('Successfully wrote file')
                        return message.channel.send(`Linked Discord account to Quaver:${username}!`)
                    }
                }); // write it back 
            }
        });
    }
}