const { Command } = require('discord.js-commando');

module.exports = class compare extends Command {
	constructor(client) {
		super(client, {
			name: 'compare',
			group: 'stats',
			memberName: 'compare',
			description: 'Compares most recent score.',
		});
	}

	run(message) {
		return message.say('Not implemented yet');
	}
};