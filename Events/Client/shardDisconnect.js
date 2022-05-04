module.exports = {
  name: "shardDisconnect",
  run: async (client, event, id) => {
  console.log(`Shard #${id} Disconnected`);
  }
};
