const mongoose = require('mongoose');

const connectDB = async () => {
  try {
    await mongoose.connect(`mongodb+srv://${process.env.username}:${process.env.password}@${process.env.cluster}.mongodb.net/${process.env.dbname}?retryWrites=true&w=majority`, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
    console.log('MongoDB connected');
  } catch (error) {
    console.error('Error connecting to MongoDB:', error.message);
  }
};

module.exports = connectDB;