const { validationResult } = require('express-validator');
const bcrypt = require("bcryptjs");
const jwt = require('jsonwebtoken');
const HttpError = require('../models/http.error');
const User = require('../models/user');


const getUsers = async (req, res, next) => {
    // const users = User.find({}, 'email name');
    let users;

    try {
        users = await User.find({}, '-password');
    } catch (err) {
        return next(new HttpError("Fetching users failed, please try again later", 500));
    }

    return res.json({ users: users.map(user => user.toObject({ getters: true })) });
};

const signup = async (req, res, next) => {
    let existingUser;
    const errors = validationResult(req);
    if (!errors.isEmpty) {
        return next(new HttpError("Invalid inputs passed, please check your data", 422));
    }

    const { name, email, password } = req.body;
    try {
        existingUser = await User.findOne({ email });
    } catch (err) {
        return next(new HttpError("Signing up failed, please try again later", 500));
    }

    if (existingUser) {
        return next(new HttpError("User exists already, please login instead", 422));
    }

    let hashedPassword;
    try {
        hashedPassword = await bcrypt.hash(password, 12);
    } catch (err) {
        return next(
            new HttpError(
                "could not create user, please try again",
                500
            )
        );
    }

    const createUser = new User({
        name,
        image: req.file.path,
        email,
        password: hashedPassword,
        places: []
    });

    try {
        await createUser.save();
    } catch (err) {
        console.log(err);
        return next(new HttpError("Signing up failed, please try again", 500));
    }

    let token;
    try {
        token = jwt.sign(
            {
                userId: createUser.id,
                email: createUser.email
            },
            process.env.jwt,
            {
                expiresIn: "1hr"
            }
        );
    } catch (err) {
        const error = new HttpError(
            "Signing up failed, please try again later",
            500
        );

        return next(error);
    }

    res.json({
        userId: createUser.id,
        email: createUser.email,
        token: token
    });
};

const login = async (req, res, next) => {
    let existingUser;
    const { email, password } = req.body;

    // get user
    try {
        existingUser = await User.findOne({ email });
    } catch (err) {
        return next(new HttpError("logging up failed, please try again later", 500));
    }

    if (!existingUser) {
        return next(new HttpError("Could not identified user. Credential seem to be wrong", 401));
    }

    // verify user password // authentication
    let isValidPassword = false;
    try {
        isValidPassword = await bcrypt.compare(password, existingUser.password);
    } catch (err) {
        const error = new HttpError(
            "Could not log you in, please check your Credentials and try again",
            500
        );
        return next(error);
    }

    if (!isValidPassword) {
        const error = new HttpError(
            "Invalid Credentials, could not log you in",
            403
        );
        return next(error);
    }

    // set token // Authorization
    let token;
    try {
        token = jwt.sign(
            {
                userId: existingUser.id,
                email: existingUser.email
            },
            process.env.jwt,
            {
                expiresIn: "1hr"
            }
        );
    } catch (err) {
        const error = new HttpError(
            "Signing up failed, please try again later",
            500
        );

        return next(error);
    }

    res.status(201).json({
        userId: existingUser.id,
        email: existingUser.email,
        token: token
    });
};

module.exports = {
    getUsers,
    signup,
    login
};