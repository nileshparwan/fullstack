const { dateToString } = require("../../helper/date");
const Event = require("../../mongoDb/models/events");
const User = require("../../mongoDb/models/user");
const { FindUserByIdHandler } = require("./merge");


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
                date: dateToString(result._doc.date),
                creator: FindUserByIdHandler.bind(this, result._doc.creator)
            };
        });
    },
    createEvent: async (args) => {
        let data, user;

        const event = new Event({
            title: args.eventInput.title,
            description: args.eventInput.description,
            price: +args.eventInput.price,
            date: dateToString(args.eventInput.date),
            creator: "64e64caf11f62caee389e715"
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
            user = await User.findById("64e64caf11f62caee389e715");
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
            date: dateToString(data._doc.date),
            creator: () => FindUserByIdHandler(data._doc.creator)
        };
    }
};