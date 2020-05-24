const { ShardingManager } = require('discord.js');

const manager = new ShardingManager("./shard.js",
    { 
        token: 'NzA5NDM3MDUyNzQzMDU3NDE4.Xr-7ZA.W9EUAAC8O01-9WGClSqZODZ0Rpg',
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
