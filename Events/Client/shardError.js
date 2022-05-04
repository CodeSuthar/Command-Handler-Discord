module.exports = {
  name: "shardError",
  run: async (client, error, id) => {
  console.log(`Shard #${id} Errored`);
  }
};