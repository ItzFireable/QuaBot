const { Command } = require('discord.js-commando');

module.exports = class topscores extends Command {
	constructor(client) {
		super(client, {
			name: 'topscores',
			group: 'stats',
			memberName: 'topscores',
			description: 'Shows users top scores.',
		});
	}

	run(message) {
		return message.say('Not implemented yet');
	}
};