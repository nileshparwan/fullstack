const express = require('express');
const bodyParser = require('body-parser');
const { graphqlHTTP } = require('express-graphql');

// internal import
const connectDB = require('./mongoDb/connectDb');
const graphqlSchema = require('./graphql/schema/index'); 
const graphqlResolvers = require('./graphql/resolvers/index'); 

// variable
const app = express();

// middlewares
app.use(bodyParser.json());

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

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});