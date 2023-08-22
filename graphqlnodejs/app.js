const express = require('express');
const bodyParser = require('body-parser');
const { graphqlHTTP } = require('express-graphql');
const { buildSchema } = require('graphql');

// variable
const app = express();

const events = [];

// middlewares
app.use(bodyParser.json());

// with graphql you have only one endpoint which graphql is sent. 
// 1. graphql endpoint, it can be anything, "/graphql", "/app", "/sth"
// 2. configure graphql
// [String!]!, the first ! means that the string value can be empty but will not return null and the second means that the array can return a list of empty value but not null
app.use(
    '/graphql',
    graphqlHTTP({
        schema: buildSchema(`
            type Event {
                _id: ID!
                title: String!,
                description: String!
                price: Float!
                date: String!
            }

            input EventInput {
                title: String!
                description: String!
                price: Float!
                date: String!
            }

            type RootQuery {
                events: [Event!]!
            }

            type RootMutation {
                createEvent(eventInput: EventInput): Event
            }

            schema {
                query:RootQuery
                mutation:RootMutation
            }
        `),
        rootValue: {
            // all resolvers function in it. and resolvers function must reach out schemas endpoint by name
            events: () => {
                return events;
            },
            createEvent: (args) => {
                const event = {
                    _id: Math.random().toString(),
                    title: args.eventInput.title,
                    description: args.eventInput.description,
                    price: +args.eventInput.price,
                    date: args.eventInput.date
                };
                events.push(event);
                return event; 
            }
        },
        graphiql: true
    }) 
);


const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});