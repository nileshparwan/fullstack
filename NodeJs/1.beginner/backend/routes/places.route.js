const express = require('express');
const { check } = require('express-validator');
const { getPlaceById, getPlacesByUserId, createPlace, updatePlaceByid, deletePlaceByid } = require('../controller/places.controller');
const checkAuth = require('../middleware/check-auth');
const fileUpload = require('../middleware/file-upload');
const router = express.Router();

router.get("/:pid", getPlaceById);
router.get("/user/:uid", getPlacesByUserId);

// middleware
router.use(checkAuth);
/**
 * So basically, the checkAuth middleware must pass before the user gets to use below path
 */

router.post(
    "/",
    fileUpload.single("image"),
    [
        check('title').notEmpty(),
        check('description').isLength({ min: 5 }),
        check('address').notEmpty()
    ],
    createPlace
); // api/places

router.patch(
    "/:pid",
    [
        check('title').notEmpty(),
        check('description').isLength({ min: 5 })
    ],
    updatePlaceByid
);

router.delete("/:pid", deletePlaceByid);


module.exports = router; 