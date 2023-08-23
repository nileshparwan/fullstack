const mongoose = require('mongoose');

const eventSchema = new mongoose.Schema({
    title: {
        type: String, 
        require: true, 
    }, 
    description: {
        type: String, 
        require: true, 
    }, 
    price: {
        type: Number, 
        require: true, 
    }, 
    date: {
        type: Date, 
        require: true, 
    }, 
    creator: {
        type: mongoose.Schema.Types.ObjectId, 
        ref: "User"
    }
}); 

module.exports = mongoose.model("Event", eventSchema); 