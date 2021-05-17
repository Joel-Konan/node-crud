let multer = require("multer");
const path = require("path");
const fs = require('fs');


// Path de stokage des fichiers uploader
const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        let pathBlogs = './public/images/blogs';
        if (file.fieldname === "blog_image") {

            fs.mkdir(pathBlogs, (err) => {
                cb(null, pathBlogs);
            });
        }

    },
    filename: (req, file, cb) => {
        if (file.fieldname === "blog_image") {
            cb(null, "blog_" + file.originalname);
        }
    }
});

// Type de fichiers qui seront acceptés
const fileFilter = (req, file, cb) => {
    if (file.fieldname === "blog_image") {
        if (
            file.mimetype === "image/jpg" ||
            file.mimetype === "image/png" ||
            file.mimetype === "image/jpeg"
        ) {
            cb(null, true);
        } else {
            cb(null, false);
        }
    }

};

// Exportation de multer
const UploadsFiles = multer({
    storage: storage,
    limits: {
        fileSize: 1024 * 1024 * 9 //  Max 1Go
    },
    fileFilter: fileFilter
})
exports.upload = UploadsFiles;