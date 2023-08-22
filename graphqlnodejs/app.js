const express = require('express');
const bodyParser = require('body-parser');
const { graphqlHTTP } = require('express-graphql');
const { buildSchema } = require('graphql');
const bcrypt = require("bcryptjs");

const connectDB = require('./mongoDb/connectDb');
const Event = require('./mongoDb/models/events');
const User = require('./mongoDb/models/user');

// variable
const app = express();

// mongoose controllers
const FindAllEventById = async (eventIds) => {
    let events;
    console.log("was here")
    try {
        events = await Event.find({
            _id: {
                $in: eventIds
            }
        });
    } catch (err) {
        throw new Error("Couldn't find event by Id");
    }

    if (!events) {
        throw new Error("Couldn't find events.");
    }

    return events.map(event => {
        return {
            ...event._doc,
            _id: event.id,
            creator: () => FindUserByIdHandler(event.creator)
        };
    });
};

const FindUserByIdHandler = async (userId) => {
    let user;

    try {
        user = await User.findById(userId);
    } catch (err) {
        throw new Error("Couldn't query user by Id");
    }

    if (!user) {
        throw new Error("Couldn't find user.");
    }

    return {
        ...user._doc,
        _id: user.id, 
        createEvent: () => FindAllEventById(user._doc.createdEvents) // or can use this FindAllEventById.bind(this, user._doc.createdEvents), but remove the arrow function
    };
};


// graphql schema and resolvers
const schema = buildSchema(`
    type Event {
        _id: ID!
        title: String!
        description: String!
        price: Float!
        date: String!
        creator: User!
    }

    type User {
        _id: ID!
        email: String!
        password: String
        createdEvents: [Event!]
    }

    input UserInput {
        email: String!
        password: String!
    }

    input EventInput {
        title: String!
        description: String!
        price: Float!
        date: String!
    }

    type RootQuery {
        events: [Event!]!
        users: [User!]!
    }

    type RootMutation {
        createEvent(eventInput: EventInput): Event
        createUser(userInput: UserInput): User
    }

    schema {
        query:RootQuery
        mutation:RootMutation
    }
`);

// all resolvers function in it. and resolvers function must reach out schemas endpoint by name
const rootValue = {
    events: async () => {
        try {
            const results = await Event.find();
            return results.map(result => {
                return {
                    ...result._doc,
                    _id: result._doc._id.toString(),
                    creator: FindUserByIdHandler.bind(this, result._doc.creator)
                };
            });
        } catch (err) {
            throw new Error("Couldn't find the event");
        }
    },
    users: async () => {
        try {
            const results = await User.find();
            return results.map(result => {
                delete result._doc.password;
                return { ...result._doc, _id: result._doc._id.toString() };
            });
        } catch (err) {
            throw new Error("Couldn't query Users");
        }
    },
    createEvent: async (args) => {
        let data, user;

        const event = new Event({
            title: args.eventInput.title,
            description: args.eventInput.description,
            price: +args.eventInput.price,
            date: new Date(args.eventInput.date),
            creator: "64e4a381397f0e693f54c9ec"
        });

        try {
            const result = await event.save();
            data = result._doc;
        } catch (err) {
            throw new Error("Couldn't create event");
        }

        try {
            user = await User.findById("64e4a381397f0e693f54c9ec");
        } catch (err) {
            throw new Error("Couldn't query user");
        }

        if (!user) {
            throw new Error("Couldn't find user");
        }

        try {
            user.createdEvents.push(event);
            await user.save();
        } catch (err) {
            throw new Error("Couldn't save user event");
        }

        // _doc._id.toString()
        // data.id
        // we can use both, the second is automatically converted to string by mongoose
        return {
            ...data,
            _id: data.id, 
            creator: () => FindUserByIdHandler(data.creator)
        };
    },
    createUser: async (args) => {
        let data, hash, userExists;

        try {
            userExists = await User.findOne({ email: args.userInput.email });
        } catch (err) {
            throw new Error("Couldn't query user");
        }

        if (userExists) {
            throw new Error("User exists already. Please login. ");
        }

        try {
            hash = await bcrypt.hash(args.userInput.password, 12);
        } catch (err) {
            throw new Error("Couldn't hash password");
        }

        const user = new User({
            email: args.userInput.email,
            password: hash,
        });

        try {
            const result = await user.save();
            data = result._doc;
        } catch (err) {
            throw new Error("Couldn't create new user");
        }

        return {
            ...data,
            password: null,
            _id: data.id
        };
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