const { Client, Intents, Collection, MessageEmbed, MessageButton, MessageSelectMenu } = require("discord.js");
const client = new Client({
  shards: "auto",
  allowedMentions: {
    parse: ["roles", "users", "everyone"],
    repliedUser: false,
  },
  intents: [
    Intents.FLAGS.GUILDS,
    Intents.FLAGS.GUILD_MESSAGES, 
    Intents.FLAGS.GUILD_MEMBERS, 
    Intents.FLAGS.GUILD_VOICE_STATES
  ]
});
const { readdirSync } = require("fs");
const mongoose = require('mongoose');

//makng some globals
client.commands = new Collection();
client.slashCommands = new Collection();
client.aliases = new Collection();
client.config = require("./config.js");
client.embedcolor = client.config.bot.embedcolor;
client.owner = client.config.bot.ownerid;
client.prefix = client.config.bot.prefix;
client.password = client.config.bot.token;

//connectng mongodb
mongoose.connect(client.config.database.mongourl, {
  useNewUrlParser: true,
  autoIndex: false,
  connectTimeoutMS: 10000,
  family: 4,
  useUnifiedTopology: true,
});
mongoose.Promise = global.Promise;
mongoose.connection.on('connected', () => {
  console.log(`[MONGODB] DATABASE CONNECTED`);
});
mongoose.connection.on('err', (err) => {
  console.log(`[MONGODB] DATABASE ERROR: \n${err.stack}`);
});
mongoose.connection.on('disconnected', () => {
  console.log(`[MONGODB] DATABASE DISCONNECTED`);
});

client.on("disconnect", () => console.log("Client is disconnecting..."))
client.on("reconnecting", () => console.log("Client reconnecting..."))
client.on('warn', error => console.log(error));
client.on('error', error => console.log(error));
process.on('unhandledRejection', error => console.log(error));
process.on('uncaughtException', error => console.log(error))

//Adding Events Category You Can Add More Category I Am Adding Only One Category
readdirSync("./Events/Client/").forEach(file => {
  const event = require(`./Events/Client/${file}`);
  client.on(event.name, (...args) => event.run(client, ...args));
});

//Addng Commands
readdirSync("./Commands/").forEach((dir) => {
  const commands = readdirSync(`./Commands/${dir}/`).filter((file) => file.endsWith(".js"));
  for (let file of commands) {
    let cmd = require(`./Commands/${dir}/${file}`);
    if (cmd.name) {
      console.log("Loading commands");
      client.commands.set(cmd.name, cmd);
    } else {
      console.log(file, `missing a cmd.name, or cmd.name is not a string.`);
      continue;
    }
    if (cmd.aliases && Array.isArray(cmd.aliases)) cmd.aliases.forEach((alias) => client.aliases.set(alias, cmd.name));
  }
})

//registering slash commands
const data = []

readdirSync("./SlashCommands/").forEach((dir) => {
  const slashFile = readdirSync(`./SlashCommands/${dir}/`).filter((files) => files.endsWith(".js"));
  for (const file of slashFile) {
    const SlashCommand = require(`./SlashCommands/${dir}/${file}`);
    if(!SlashCommand.name) return console.error(`slashCommandNameError: ${SlashCommand.split(".")[0]} application command name is required.`);
    if(!SlashCommand.description) return console.error(`slashCommandDescriptionError: ${SlashCommand.split(".")[0]} application command description is required.`);
    client.slashCommands.set(SlashCommand.name, SlashCommand);
    console.log(`${SlashCommand.name} SlashCommands registered to client`);
    data.push(SlashCommand);
  }
});

client.login(client.password)