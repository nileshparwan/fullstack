const express = require('express');
const bodyParser = require('body-parser');
const { graphqlHTTP } = require('express-graphql');

// internal import
const connectDB = require('./mongoDb/connectDb');
const graphqlSchema = require('./graphql/schema/index'); 
const graphqlResolvers = require('./graphql/resolvers/index'); 
const isAuth = require('./middlewares/isAuth');

// variable
const app = express();

const allowedDomains = [];

// cors 
app.use((req, res, next)=>{

    if (allowedDomains.length > 0) {
        const origin = req.get("origin");
        if (allowedDomains.includes(origin)) {
            res.setHeader("Access-Control-Allow-Origin", origin);
        } else {
            res.setHeader("Access-Control-Allow-Origin", "null"); // Change to your fallback origin
        }
    } else {
        res.setHeader(
            "Access-Control-Allow-Origin",
            "*"
        );
    }

    // Other CORS headers
    res.setHeader("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept, Authorization");
    res.setHeader("Access-Control-Allow-Methods", "GET, POST, PUT, DELETE, OPTIONS");

    if (req.method === "OPTIONS") {
        return res.sendStatus(200)
        // return next();
    }

    next();
})

// middlewares
app.use(bodyParser.json());

// check user authentication
app.use(isAuth);

// with graphql you have only one endpoint which graphql is sent. 
// 1. graphql endpoint, it can be anything, "/graphql", "/app", "/sth"
// 2. configure graphql
// [String!]!, the first ! means that the string value can be empty but will not return null and the second means that the array can return a list of empty value but not null
app.use(
    '/graphql',
    graphqlHTTP({
        schema: graphqlSchema,
        rootValue: graphqlResolvers,
        graphiql: true
    })
);

// db 
connectDB();

const PORT = process.env.PORT || 8000;
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});