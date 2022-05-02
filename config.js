module.exports = {
  bot: {
    token: process.env.token || "OTY5NTU4ODQwOTI2NDM3NDA2.YmvKCQ.3cOvHE03z1eS-iea6mwtsiBXzOo", //your bot token here, i recommend you to use env secrets
    embedcolor: process.env.color || "RANDOM",
    ownerid: process.env.ownerid || "880675703761272854",
    prefix: process.env.prefix || "!",
  },
  database: {
    mongourl: process.env.connectingurl || "mongodb+srv://Zeon:Zeon@cluster0.610gv.mongodb.net/myFirstDatabase?retryWrites=true&w=majority"
  },
}