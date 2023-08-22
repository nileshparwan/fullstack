const bcrypt = require("bcryptjs");
const Event = require("../../mongoDb/models/events");
const User = require("../../mongoDb/models/user");

// all resolvers function in it. and resolvers function must reach out schemas endpoint by name
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
            date: new Date(event._doc.date).toISOString(),
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

module.exports = {
    events: async () => {
        try {
            const results = await Event.find();
            return results.map(result => {
                return {
                    ...result._doc,
                    _id: result._doc._id.toString(),
                    date: new Date(result._doc.date).toISOString(),
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
            date: new Date(data.date).toISOString(),
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
}