const { MessageEmbed, Permissions } = require("discord.js");

module.exports = {
  name: "messageCreate",
  run: async (client, message) => {
    if(!message.guild || message.author.bot) return;
    let prefix = client.prefix;
    const channel = message?.channel;
    const mentionedtheclient = new RegExp(`^<@!?${client.user.id}>( |)$`);
    if (message.content.match(mentionedtheclient)) {
      const embed = new MessageEmbed()
      .setColor(client.embedcolor)
      .setDescription(`**My prefix in this digital area is \`${prefix}\`**\n**› You can scroll my all commands type \`${prefix}\`help**`);
      message.channel.send({embeds: [embed]})
    }
    const escapeRegex = (str) => str.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
    const prefixRegex = new RegExp(`^(<@!?${client.user.id}>|${escapeRegex(prefix)})\\s*`);
    if (!prefixRegex.test(message.content)) return;
    const [ matchedPrefix ] = message.content.match(prefixRegex);
    const args = message.content.slice(matchedPrefix.length).trim().split(/ +/);
    const cmd = args.shift().toLowerCase();

    let command = client.commands.get(cmd);
    if(!command) command = client.commands.get(client.aliases.get(cmd));

    if (command.userpermissions && !message.member.permissions.has(command.userpermissions)) {
      const errorembed = new MessageEmbed()
      .setTitle("You don't have required permissions to use this command")
      .setColor("#e01e01")
      .setDescription(`You need one of these permissions to use this command \`${command.userpermissions}\``)
      return message.channel.send({embeds: [errorembed]}).then(msg => {setTimeout(()=>{msg.delete().catch((e) => {console.log(e)})}, 10000)}).catch((e) => {console.log(e)});
    }

    if (command.minargs && command.minargs > 0 && args.length < command.minargs) {
      const errorembed = new MessageEmbed()
      .setTitle("You didn't used ths command in a right way")
      .setColor("#e01e01")
      .setDescription(`You need to use this command like ths example \`${command.usage}\``)
      return message.channel.send({embeds: [errorembed]}).then(msg => {setTimeout(()=>{msg.delete().catch((e) => {console.log(e)})}, 10000)}).catch((e) => {console.log(e)});
    }

    if (command.maxargs && command.maxargs > 0 && args.length > command.maxargs) {
      const errorembed = new MessageEmbed()
      .setTitle("You didn't used ths command in a right way")
      .setColor("#e01e01")
      .setDescription(`You need to use this command like ths example \`${command.usage}\``)
      return message.channel.send({embeds: [errorembed]}).then(msg => {setTimeout(()=>{msg.delete().catch((e) => {console.log(e)})}, 10000)}).catch((e) => {console.log(e)});
    }

    try {
      command.execute(message, args, client, prefix);
    } catch (error) {
      console.log(error);
      const embed = new MessageEmbed()
      .setDescription("There was an error executing that command.\nI have contacted the owner of the bot to fix it immediately.");
      return message.channel.send({embeds: [embed]});
    }
  }
}