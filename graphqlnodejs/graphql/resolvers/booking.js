const Booking = require("../../mongoDb/models/booking");
const Event = require("../../mongoDb/models/events");
const { dateToString } = require("../../helper/date");
const { FindUserByIdHandler, singleEvent } = require("./merge");

// all resolvers function in it. and resolvers function must reach out schemas endpoint by name

module.exports = {
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
                createdAt: dateToString(booking._doc.createdAt),
                updatedAt: dateToString(booking._doc.updatedAt),
            };
        });
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
            user: "64e64caf11f62caee389e715",
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
            createdAt: dateToString(result._doc.createdAt),
            updatedAt: dateToString(result._doc.updatedAt)
        };
    }
};