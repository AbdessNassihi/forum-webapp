const multer = require('multer');
const path = require('path');


const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, 'uploads/');
    },
    filename: function (req, file, cb) {
        cb(null, Date.now() + '_' + file.originalname);
    }
});

const imageFilter = function (req, file, cb) {
    if (!file.originalname.match(/\.(jpg|jpeg|png|gif)$/)) {
        return cb(new Error('Invalid file type'), false);
    }
    cb(null, true);
};

const getImagePath = (req, user) => {
    if (req.file) {
        return req.file.path;
    }
    if (user) { return user.img_url }
    return path.join('/uploads', 'default_image.jpg');
}

const upload = multer({ storage: storage, fileFilter: imageFilter });


const handleImageUpload = (req, res, next) => {
    upload.single('profileImage')(req, res, (err) => {
        if (err) {
            return res.status(400).json({ code: 400, status: 'Bad Request', message: err.message });
        }
        next();
    });
};
module.exports = {
    handleImageUpload,
    getImagePath
};