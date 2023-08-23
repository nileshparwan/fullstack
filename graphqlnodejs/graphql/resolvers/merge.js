const { dateToString } = require("../../helper/date");
const Event = require("../../mongoDb/models/events");
const User = require("../../mongoDb/models/user");


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
            date: dateToString(event._doc.date),
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
    FindAllEventById,
    FindUserByIdHandler,
    singleEvent
};