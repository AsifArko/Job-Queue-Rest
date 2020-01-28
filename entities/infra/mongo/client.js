const mongoose = require('mongoose');
const config = require('config');
const cfg = config.get('mongo.uri');
const mongoDebug = config.get('mongo.debug');

exports.initializeMongoDB = () => {
    let connectWithRetry = () => {
        mongoose.set("useCreateIndex", true);
        mongoose.set("debug", mongoDebug);
        mongoose.set("useUnifiedTopology", true);

        return mongoose.connect(cfg, {useNewUrlParser: true}, (error) => {
            if (error) {
                console.log("Failed to Initialize MongoDB - retrying in 5 sec", error);
                setTimeout(connectWithRetry, 5000);
                return;
            }
            const db = mongoose.connection;
            db.on('error', console.error.bind(console, "DB connection error"));
            db.once('open', () => {
                console.log("MongoDB connection initialized")
            })
        })
    };
    connectWithRetry();
};