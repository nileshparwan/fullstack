const express = require('express');
const bodyParser = require('body-parser');
const { graphqlHTTP } = require('express-graphql');
const { buildSchema } = require('graphql');
const connectDB = require('./mongoDb/connectDb');
const Event = require('./mongoDb/models/events');

// variable
const app = express();

const events = [];

// graphql schema and resolvers
const schema = buildSchema(`
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
`);

const rootValue = {
    // all resolvers function in it. and resolvers function must reach out schemas endpoint by name
    events: async () => {
        try {
            const results = await Event.find();
            return results.map(result => {
                return { ...result._doc, _id: result._doc._id.toString() };
            });
        } catch (err) {
            throw new Error("Couldn't find the event");
        }
    },
    createEvent: async (args) => {
        let data;

        const event = new Event({
            title: args.eventInput.title,
            description: args.eventInput.description,
            price: +args.eventInput.price,
            date: new Date(args.eventInput.date)
        });

        try {
            const result = await event.save();
            data = result._doc;
        } catch (err) {
            console.log(err);
            throw new Error("Couldn't create event");
        }

        // _doc._id.toString()
        // data.id
        // we can use both, the second is automatically converted to string by mongoose
        return { ...data, _id: data.id };
    }
};

// middlewares
app.use(bodyParser.json());

// with graphql you have only one endpoint which graphql is sent. 
// 1. graphql endpoint, it can be anything, "/graphql", "/app", "/sth"
// 2. configure graphql
// [String!]!, the first ! means that the string value can be empty but will not return null and the second means that the array can return a list of empty value but not null
app.use(
    '/graphql',
    graphqlHTTP({
        schema,
        rootValue,
        graphiql: true
    })
);

// db 
connectDB();

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});