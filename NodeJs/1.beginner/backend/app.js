const fs = require('fs'); 
const path = require("path");
const express = require('express');
const bodyParser = require('body-parser');

// routes
const placesRoutes = require('./routes/places.route');
const usersRoutes = require('./routes/users.route');
const HttpError = require('./models/http.error');
const { ConnectDatabase } = require('./mongodb/mongo');

const app = express();

// parse application/json
app.use(bodyParser.json());

// middleware to grant access to images
app.use("/uploads/images", express.static(path.join('uploads', 'images')))

//  cors 
app.use((req, res, next) => {
     // * -> can be replace by any domain
     // like whitelisting localhost:3000
    res.setHeader(
        "Access-Control-Allow-Origin",
        "*"
    );

    // which request send by the browser may have
    res.setHeader(
        "Access-Control-Allow-Headers",
        "Origin, X-Api-Key, X-Requested-With, Content-Type, Accept, Authorization"
    );

    // which method may be used by the browser ( incoming or outgoing )
    res.setHeader(
        "Access-Control-Allow-Methods",
        "POST, PUT, PATCH, GET, DELETE, OPTIONS"
    ); 

    next();
});

// middleware to grant user access to the following routes
app.use('/api/places', placesRoutes);
app.use('/api/users', usersRoutes);

// error handling for unsupported route 
app.use((req, res, next) => {
    throw new HttpError("Could not find this route", 404);
});

// error handler 
app.use((error, req, res, next) => {
    if (req.file) {
        console.log(req.file);
        fs.unlink(req.file.path, (err) => {
            if(err){
                console.log(err);
            }
        }); 
    }
    if (res.headerSent) { // check if response have already been sent. 
        return next(error);
    }
    res.status(error.code || 500);
    res.json({ message: error.message || "An unknown error occurred!" });
});

const startServer = (portNumber) => {
    app.listen(portNumber, () => {
        console.log("Development server started");
    });
};

ConnectDatabase();
startServer(process.env.PORT || 9000);
// process.env.PORT => this is provided by the hosting service