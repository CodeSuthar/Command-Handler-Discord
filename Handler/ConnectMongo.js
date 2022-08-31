const { connect, connection } = require("mongoose");
const LinkMongoDB = connect;
const MongoDBStatus = connection;

module.exports = (client) => {
    LinkMongoDB(client.config.MongoConnectorURL, MongoConnectorOption())
    MongoDBStatus.on('connected', () => {
        console.log("[ DB LOG ] " + 'DATABASE CONNECTED');
    });
    MongoDBStatus.on('err', (err) => {
       console.log("[ DB LOG ] " + `Mongoose connection error: \n ${err.stack}` );
    });
    MongoDBStatus.on('disconnected', () => {
        console.log("[ DB LOG ] " + 'Mongoose disconnected');
    });
}

function MongoConnectorOption() {
    return {
        useNewUrlParser: true,
        autoIndex: false,
        connectTimeoutMS: 10000,
        family: 4,
        useUnifiedTopology: true,
    }
}