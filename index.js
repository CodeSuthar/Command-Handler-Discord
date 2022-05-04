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
const colors = require("colors");

//makng some globals
client.commands = new Collection();
client.slashCommands = new Collection();
client.aliases = new Collection();
client.config = require("./config.js");
client.embedcolor = client.config.bot.embedcolor;
client.ownerid = client.config.bot.ownerid;
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
  console.log(`[MONGODB] DATABASE CONNECTED`.america);
});
mongoose.connection.on('err', (err) => {
  console.log(`[MONGODB] DATABASE ERROR: \n${err.stack}`.grey);
});
mongoose.connection.on('disconnected', () => {
  console.log(`[MONGODB] DATABASE DISCONNECTED`.bgBrightRed);
});

client.on("disconnect", () => console.log(`[CLIENT] ${client.user.username} is disconnecting...`.brightRed))
client.on("reconnecting", () => console.log(`[CLIENT] ${client.user.username} is reconnecting...`.zebra))
client.on('warn', error => console.log(error));
client.on('error', error => console.log(error));
process.on('unhandledRejection', error => console.log(error));
process.on('uncaughtException', error => console.log(error))

//Adding Events Category You Can Add More Category I Am Adding Only One Category
readdirSync("./Events/Client/").forEach(file => {
  const event = require(`./Events/Client/${file}`);
  console.log(`[EVENTS] Client event named ${event.name} loaded`.random);
  client.on(event.name, (...args) => event.run(client, ...args));
});

//Addng Commands
readdirSync("./Commands/").forEach((dir) => {
  const commands = readdirSync(`./Commands/${dir}/`).filter((file) => file.endsWith(".js"));
  for (let file of commands) {
    let cmd = require(`./Commands/${dir}/${file}`);
    if (cmd.name) {
      console.log(`[COMMANDS] Loading command named ${cmd.name}`.brightCyan);
      client.commands.set(cmd.name, cmd);
    } else {
      console.log("[COMMANDS]", file, `missing a cmd.name, or cmd.name is not a string.`.brightRed);
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
    if(!SlashCommand.name) return console.error(`[SLASH COMMANDS] NameError: ${SlashCommand.split(".")[0]} Application command name is required.`.brightRed);
    if(!SlashCommand.description) return console.error(`[SLASH COMMANDS] DescriptionError: ${SlashCommand.split(".")[0]} Application command description is required.`.brightRed);
    client.slashCommands.set(SlashCommand.name, SlashCommand);
    console.log(`[SLASH COMMANDS] ${SlashCommand.name} Application command is added for being registered to client`.brightMagenta);
    data.push(SlashCommand);
  }
});

client.on("ready", async () => {
  await client.application.commands.set(data).then(() => console.log(`[SLASH COMMANDS] Application commands are registered to client.`.brightBlue)).catch((e) => console.log(e));
})

client.login(client.password)