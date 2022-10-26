const { Client, Collection, GatewayIntentBits, Partials } = require("discord.js");
const client = new Client(
    Heart(GatewayIntentBits, Partials)
);

client.SlashCMD = new Collection();
client.config = require("./config.js");

client.rest.on('rateLimited', (info) => {
    console.log("[ Rate Limited Log ]" + info);
});
  
[ "ClientEvents", "SlashCommands", "ConnectMongo", "HandlingError" ].forEach((Handler) => {
    try {
        require(`./Handler/${Handler}`)(client)
        console.log(`[HANDLER] Loaded ${Handler} System`)
    } catch (e) {
        console.log(`Error Found In Handler Called ${Handler}\n${e}`)
    }
})

client.login(client.config.Bot.Token);

function Heart(blood, oxygen) {
    return {
        shards: "auto",
        failIfNotExists: true,
        allowedMentions: {
            everyone: false,
            roles: false,
            users: false
        },
        intents: [
            blood.Guilds,
            blood.MessageContent,
            blood.GuildVoiceStates,
            blood.GuildMessages,
            blood.DirectMessages,
            blood.GuildInvites,
        ],
        partials: [ 
            oxygen.Channel, 
            oxygen.Message, 
            oxygen.User, 
            oxygen.GuildMember
        ]
    }
}
