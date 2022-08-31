const { readdirSync } = require("fs");

module.exports = (client) => {
    readdirSync("./Events/ClientEvents/").forEach(file => {
        const event = require(`../Events/ClientEvents/${file}`);
        console.log(`[EVENTS] Client event named ${event.name} loaded`);
        client.on(event.name, (...args) => event.run(client, ...args));
    });
}