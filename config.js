module.exports = {
  bot: {
    token: process.env.token || "",
    embedcolor: process.env.color || "",
    ownerid: process.env.ownerid || "",
    prefix: process.env.prefix || "",
  },

  database: {
    mongourl: process.env.connectingurl || ""
  },

  logs: {
    guildlog: ""
  }
}