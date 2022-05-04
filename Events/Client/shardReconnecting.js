module.exports = {
  name: "shardReconnecting",
  run: async (client, id) => {
  console.log(`Shard #${id} Reconnecting`);
  }
};