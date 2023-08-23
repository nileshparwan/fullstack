const bcrypt = require("bcryptjs");
const User = require("../../mongoDb/models/user");
// all resolvers function in it. and resolvers function must reach out schemas endpoint by name

module.exports = {
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

};