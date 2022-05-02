module.exports = {
  name: "ready",
  run: async (client, message) => {
    console.log(client.user.username)
  }
}