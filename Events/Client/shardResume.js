module.exports = {
  name: "shardResume",
  run: async (client, id, replayedEvents) => {
  console.log(`Shard #${id} Resumed`);
  }
};
