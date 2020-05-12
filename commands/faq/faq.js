const { Command } = require("discord.js-commando");
const localization = require("./commands/faq/localization.js");

module.exports = class faq extends Command {
    constructor(client) {
        super(client, {
            name: "faq",
            group: "faq",
            memberName: "faq",
            description: "Returns an answer to a frequently asked question",
            args: [
                {
                    key: "key",
                    prompt: "What FAQ needs to be answered?",
                    type: "string",
                },
                {
                    key: "language",
                    prompt: "What language do you need the FAQ answered in?",
                    type: "string",
                    default: "en"
                }
            ]
        });
    }
    run(message, { key, language }) {
        let lookupLanguage = language in localization.prompts ? language : "en";
        let message =
            key in localization.prompts[lookupLanguage]
                ? localization.prompts[lookupLanguage][key]
                : ["Question could not be found!"];
        message.channel.send(message.join("\n"));
    }
};
