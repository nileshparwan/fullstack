const bcrypt = require("bcryptjs");
const jwt = require('jsonwebtoken');
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
            data = await user.save();
        } catch (err) {
            throw new Error("Couldn't create new user");
        }

        return {
            ...data._doc,
            _id: data.id,
            password: null,
        };
    },
    login: async ({ email, password }) => {
        let user, passwordIsEqual;

        try {
            user = await User.findOne({ email: email });
        } catch (err) {
            throw new Error("Could not query user. Please try again later");
        }

        if (!user) {
            throw new Error("Invalid credential!");
        }

        try {
            passwordIsEqual = await bcrypt.compare(password, user.password);
        } catch (err) {
            throw new Error("Password verification failed");
        }

        if (!passwordIsEqual) {
            throw new Error("Invalid credentials!");
        }

        const token = jwt.sign(
            { userId: user.id, email },
            "somesupersecretkey",
            { expiresIn: "1h" }
        );

        
        return {
            userId: user.id,
            token,
            tokenExpiration: 1
        }
    }
};