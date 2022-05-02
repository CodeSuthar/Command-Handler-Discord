const { MessageEmbed } = require("discord.js");

module.exports = {
    name: "ping",
    category: "Information",
    description: "Check Ping Bot",
    usage: "ping bot",
    owner: false,
    execute: async (message, args, client, prefix) => {
      
  await message.reply({ content: "Pinging..." }).then(async (msg) => {
  const ping = msg.createdAt - message.createdAt;
  const api_ping = client.ws.ping;
 
  await msg.edit({
    content: `🏓\nBot Latency: \`\`\`[ ${ping}ms ]\`\`\`\nAPI Latency: \`\`\`[ ${api_ping}ms ]\`\`\``,
  })
 })
 }
}
