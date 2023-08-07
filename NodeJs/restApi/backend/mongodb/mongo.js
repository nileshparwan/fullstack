const mongoose = require('mongoose');

// connect to db and application
const username = process.env.username;
const password = process.env.password;
const cluster = process.env.cluster;
const dbname = process.env.dbname;

const ConnectDatabase = async () => {

    // to handle mongoose initial connection error
    // try {
        // const db = mongoose.connection;

    mongoose.connect(`mongodb+srv://${username}:${password}@${cluster}.mongodb.net/${dbname}?retryWrites=true&w=majority`, {
        useNewUrlParser: true,
        useUnifiedTopology: true
    }).then(() => {
        console.log("Connected successfully");
    }).catch((error) => {
        console.log("Connection error", error);
    });

        // //  to handle error after connection has been established
        // db.on('error', (error) => {
        //     console.error("Connection error", error);
        // });


        // db.once('open', function () {
        //     console.log("Connected successfully");
        // });

    // } catch (error) {
    //     console.log("Couldn't establish Mongo DB connection to server");
    // }

};

module.exports = {
    ConnectDatabase
};