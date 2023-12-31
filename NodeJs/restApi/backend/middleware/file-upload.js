const multer = require('multer');
const uuid = require('uuid'); 

const MIME_TYPE_MAP = {
    'image/png':'png',
    'image/jpeg':'jpeg',
    'image/jpg':'jpg',
}

const fileUpload = multer({
    limits: 500000,
    storage: multer.diskStorage({ //useful for storing a file correctly
        destination: (req, file, cb) => {
            cb(null, 'uploads/images');
        },
        filename: (req, file, cb) => {
            const ext = MIME_TYPE_MAP[file.mimetype];
            cb(null, uuid.v1() + "." + ext);
        }
    }),
    fileFilter: (req, file, cb) => {
        const isValid = !!MIME_TYPE_MAP[file.mimetype];
        let error = isValid ? null : new Error('Invalid mime type');
        cb(error, isValid); // error if error else if null it succeeds. 
    }
}); 

module.exports = fileUpload;