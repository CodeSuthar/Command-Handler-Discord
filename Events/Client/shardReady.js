
module.exports = {
  name: "shardReady",
  run: async (client, id) => {
  console.log(`Shard #${id} Ready`);
  }
};
