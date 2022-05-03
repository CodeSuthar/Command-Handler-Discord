const { MessageEmbed } = require("discord.js");
const dbprefix = require("../../Schema/prefix.js")

module.exports = {
  name: "interactionCreate",
  run: async (client, interaction) => {
    let prefix = client.prefix;
    const ress =  await dbprefix.findOne({Guild: interaction.guildId})

    if(interaction.isCommand()) {
      const SlashCommands = client.slashCommands.get(interaction.commandName);
      if(!SlashCommands) return;

      if (SlashCommands.owner && interaction.user.id !== `${client.ownerid}`) {
        const errorembed = new MessageEmbed()
        .setColor("#e01e01")
        .setDescription(`Only <@${client.ownerid}> can use this command!`)
        await interaction.reply({
          embeds: [errorembed]
        })
      }

      try {
        await SlashCommands.run(client, interaction, prefix);
      } catch (error) {
        if(interaction.replied) {
          await interaction.editReply({
            content: `An unexcepted error occured.`
          }).catch(() => {});
        } else {
          await interaction.followUp({
            ephemeral: true,
            content: `An unexcepted error occured.`
          }).catch(() => {})
        }
      };
    } else return;
  }
};