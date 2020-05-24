const { Command } = require('discord.js-commando');

module.exports = class leaderboard extends Command {
	constructor(client) {
		super(client, {
			name: 'leaderboard',
			group: 'stats',
			memberName: 'leaderboard',
			description: 'Shows leaderboards for a map',
		});
	}

	run(message) {
		return message.say('Not implemented yet');
	}
};