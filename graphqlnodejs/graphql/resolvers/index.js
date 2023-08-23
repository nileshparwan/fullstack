const bcrypt = require("bcryptjs");
const Event = require("../../mongoDb/models/events");
const User = require("../../mongoDb/models/user");
const Booking = require("../../mongoDb/models/booking");

// all resolvers function in it. and resolvers function must reach out schemas endpoint by name
// mongoose controllers
const FindAllEventById = async (eventIds) => {
    let events;

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

const singleEvent = async (eventId) => {
    let event;
    try {
        event = await Event.findById(eventId);
    } catch (err) {
        throw new Error("couldn't query event by id");
    }

    if (!event) {
        throw new Error("No event found");
    }

    return {
        ...event._doc,
        _id: event.id,
        creator: () => FindUserByIdHandler(event.creator)
    };
};

module.exports = {
    events: async () => {
        let results;

        try {
            results = await Event.find();
        } catch (err) {
            throw new Error("Couldn't find the event");
        }

        return results.map(result => {
            return {
                ...result._doc,
                _id: result._doc._id.toString(),
                date: new Date(result._doc.date).toISOString(),
                creator: FindUserByIdHandler.bind(this, result._doc.creator)
            };
        });
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
    bookings: async () => {
        let bookings;

        try {
            bookings = await Booking.find();
        } catch (err) {
            throw new Error("Couldn't query booking");
        }

        if (!bookings) {
            throw new Error("couldn't find any booking");
        }

        return bookings.map(booking => {
            return {
                ...booking._doc,
                id: booking.id,
                user: () => FindUserByIdHandler(booking._doc.user),
                event: () => singleEvent(booking._doc.event),
                createdAt: new Date(booking._doc.createdAt).toISOString(),
                updatedAt: new Date(booking._doc.updatedAt).toISOString(),
            };
        });
    },
    createEvent: async (args) => {
        let data, user;

        const event = new Event({
            title: args.eventInput.title,
            description: args.eventInput.description,
            price: +args.eventInput.price,
            date: new Date(args.eventInput.date).toISOString(),
            creator: "64e5d98428bb5b8ae8f4cfad"
        });

        // Validate the date value before saving the event
        if (isNaN(Date.parse(event.date))) {
            throw new Error("Invalid date format. Please provide a valid date.");
        }

        try {
            data = await event.save();
        } catch (err) {
            throw new Error("Couldn't create event");
        }

        try {
            user = await User.findById("64e5d98428bb5b8ae8f4cfad");
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
            ...data._doc,
            _id: data.id,
            date: new Date(data._doc.date).toISOString(),
            creator: () => FindUserByIdHandler(data._doc.creator)
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
    },
    bookEvent: async (args) => {
        let fetchEvent, result;

        try {
            fetchEvent = await Event.findOne({ _id: args.eventId });
        } catch (err) {
            throw new Error("Couldn't query event");
        }

        if (!fetchEvent) {
            throw new Error("No event found");
        }

        const booking = new Booking({
            user: "64e5d98428bb5b8ae8f4cfad",
            event: fetchEvent
        });

        try {
            result = await booking.save();
        } catch (err) {
            throw new Error("couldn't save booking");
        }

        return {
            ...result._doc,
            _id: result.id,
            user: () => FindUserByIdHandler(result._doc.user),
            event: () => singleEvent(result._doc.event),
            createdAt: new Date(result._doc.createdAt).toISOString(),
            updatedAt: new Date(result._doc.updatedAt).toISOString()
        };
    },
    cancelBooking: async (args) => {
        let booking, event;

        try {
            booking = await Booking.findById(args.bookingId).populate("event");
        } catch (err) {
            throw new Error("Couldn't query booking id. Please try again!");
        }

        if (!booking) {
            throw new Error("This booking doesn't exists");
        }

        event = {
            ...booking.event._doc,
            _id: booking.event.id,
            creator: () => FindUserByIdHandler(booking.event._doc.creator)
        };

        try {
            await Booking.deleteOne({ _id: args.bookingId });
        } catch (err) {
            throw new Error("Couldn't remove this booking");
        }

        return event;
    }
};