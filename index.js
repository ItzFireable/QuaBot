const { ShardingManager } = require('discord.js');

const manager = new ShardingManager("./shard.js",
    { 
        token: process.env.BOT_TOKEN,
	totalShards: 'auto',
	respawn: false,
        shardArgs: process.argv.slice(2) 
    }	
);

manager.on("launch", shard => {
	const shard_id = shard.id;
	console.log("Launched shard " + shard.id);
	shard.on("death", () => {
		setTimeout(() => {
			manager.createShard(shard_id);
		}, 5000);
	});
});

manager.spawn(undefined, 10000);
