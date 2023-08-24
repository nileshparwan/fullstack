const mongoose = require("mongoose");

const bookingSchema = new mongoose.Schema({
    event: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Event"
    },
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User"
    }
}, {
    timestamps: true // mongoose will automatically add a created at and updated at field to every entry in the data. So that we can find out when a user booked an event. 
});

module.exports = mongoose.model("booking", bookingSchema)

