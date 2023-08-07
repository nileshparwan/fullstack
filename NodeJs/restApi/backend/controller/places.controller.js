// const { v4: uuidv4 } = require('uuid');
const fs = require("fs");
const { validationResult } = require('express-validator');
const HttpError = require('../models/http.error');
const { getCoordforAddress } = require('../util/location');
const Place = require('../models/place');
const User = require('../models/user');
const { default: mongoose } = require('mongoose');

const getPlaceById = async (req, res, next) => {
    const placeId = req.params.pid;
    let place;

    try {
        place = await Place.findById(placeId);
    } catch (e) {
        const error = new HttpError("Something went wrong", 404);
        return next(error);
    }

    if (!place) {
        // sync error handler
        const placeError = new HttpError("could not find a place for the provided id", 404);
        return next(placeError);
    }

    return res.json({ place: place.toObject({ getters: true }) });
    //  toObject -> normal object 
    // getters -> remove underscore from _id
};

const getPlacesByUserId = async (req, res, next) => {
    let userWithPlaces;
    const uid = req.params.uid;
    
    try {
        userWithPlaces = await User.findById(uid).populate("places");
    } catch (e) {
        return next(new HttpError("could not find a place for the provided id", 404));
    }

    if (!userWithPlaces || userWithPlaces.length === 0) {
        return next(new HttpError("could not find a place for the provided id", 404));
    }

    return res.json({ places: userWithPlaces.places.map(place => place.toObject({ getters: true })) });
};

const createPlace = async (req, res, next) => {
    let coordinates, user;
    const errors = validationResult(req);

    if (!errors.isEmpty) {
        console.log(errors);
        return next(new HttpError("Invalid inputs passed, please check your data", 422));
        // throw doesn't work with async - so you must use next
    }

    const { title, description, address } = req.body;

    try {
        coordinates = await getCoordforAddress(address);
    } catch (error) {
        return next(error);
    }

    const createdPlace = new Place({
        title,
        description,
        address,
        location: coordinates,
        image: req.file.path, 
        creator: req.userData.userId
    });

    try {
        user = await User.findById(req.userData.userId);
    } catch (err) {
        const error = new HttpError(
            "Cannot find user for provided ID",
            404
        );
        return next(error);
    }

    if (!user) {
        return next(
            new HttpError(
                "Creating place failed, please try again",
                500
            )
        );
    }

    try {
        const sess = await mongoose.startSession();
        sess.startTransaction();
        await createdPlace.save({ session: sess }); // save place in a session
        user.places.push(createdPlace); // add place id to user.places array 
        await user.save({ sesssion: sess }); // save user
        await sess.commitTransaction(); // commit changes 
    } catch (e) {
        const error = new HttpError(
            "Creating place failed, please try again",
            500
        );
        return next(error);
    }

    return res.status(201).json({ place: createdPlace });
};

const updatePlaceByid = async (req, res, next) => {
    let place;
    let errors = validationResult(req);

    if (!errors.isEmpty) {
        return next(new HttpError("Invalid inputs passed, please check your data", 422));
    }

    const pid = req.params.pid;
    const { title, description } = req.body;

    try {
        place = await Place.findById(pid);
    } catch (err) {
        return next(new HttpError("Something went wrong, could not update place", 500));
    }

    // security measures
    // it prevent a user from updating another person content, for example from postman
    if (place.creator.toString() !== req.userData.userId) {
        return next(new HttpError("You are not allowed to edit this place", 401));
    }

    place.title = title; 
    place.description = description;

    try {
        place.save();
    } catch (err) {
        return next(new HttpError("Something went wrong, could not save place", 500));
    }

    return res.status(200).json({ place: place.toObject({ getters: true }) }); 
};

const deletePlaceByid = async (req, res, next) => {
    let place; 
    const placeId = req.params.pid; 

    try {
        place = await Place.findById(placeId).populate('creator'); 
        // to use populate, collection must be in relationship
    } catch (err) {
        return next(new HttpError("Something went wrong, could not delete place", 500));
    }

    if (!place) {
        const error = new HttpError("Could not find place for this id", 404);
        return next(error); 
    }

    if (place.creator.id !== req.userData.userId) {
        return next(new HttpError("You are not allowed to delete this place", 401));
    }

    const imagePath = place.image;

    try {
        // Todo: to google this concept
        // await place.deleteOne({ id: placeId });
        const sess = await mongoose.startSession(); 
        sess.startTransaction(); 
        await place.deleteOne({session: sess}); 
        place.creator.places.pull(place);
        await place.creator.save({session: sess});  
        await sess.commitTransaction();

    } catch(err) {
        return next(new HttpError("Something went wrong, could not remove place", 500));
    }

    // delete image 
    fs.unlink(imagePath, err => {
        if (err) {
            console.log(err);
        }
    });
    
    res.status(200).json({ message: "Deleted place." }); 
};

module.exports = {
    getPlaceById,
    getPlacesByUserId,
    createPlace,
    updatePlaceByid,
    deletePlaceByid
};