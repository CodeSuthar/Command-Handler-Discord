const { readdirSync } = require("fs");
const { PermissionsBitField, Routes } = require("discord.js");
const { REST } = require("@discordjs/rest");

module.exports = (client) => {
    const data = [];
    readdirSync("./SlashCommands/").forEach((dir) => {
        const slashCommandFile = readdirSync(`./SlashCommands/${dir}/`).filter((files) => files.endsWith(".js"));
        for (const file of slashCommandFile) {
            const slashCommand = require(`../SlashCommands/${dir}/${file}`);

            if (!slashCommand.name) return console.error(`slashCommandNameError: ${slashCommand.split(".")[0]} application command name is required.`);

            if (!slashCommand.description) return console.error(`slashCommandDescriptionError: ${slashCommand.split(".")[0]} application command description is required.`);

            client.slashCommands.set(slashCommand.name, slashCommand);
            console.log(`[ Slash CMD ] Client SlashCommands Command (/) Loaded: ${slashCommand.name}`);

            data.push({
                name: slashCommand.name,
                description: slashCommand.description,
                type: slashCommand.type,
                options: slashCommand.options ? slashCommand.options : null,
                default_member_permissions: slashCommand.memberpermission ? PermissionsBitField.resolve(slashCommand.memberpermission).toString() : null,
                dm_permission: slashCommand.dm ? slashCommand.dm : null
            });
        }
    });
    const rest = new REST({ version: "10" }).setToken(client.config.Bot.Token);
    client.on("ready", async () => {
        (async () => {
            try {
                console.log(`[ Slash CMD ] Started refreshing application (/) commands.`);
                await rest.put(Routes.applicationCommands(client.user.id), {
                   body: data,
                });
                console.log(`[ Slash CMD ] Successfully reloaded application (/) commands.`);
            } catch (error) {
                console.error(`[ Slash CMD ] SlashError: ${error}`);
            }
        })();
    })
};