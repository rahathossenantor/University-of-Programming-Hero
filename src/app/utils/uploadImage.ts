import { v2 as cloudinary } from "cloudinary";
import multer from "multer";
import config from "../config";
import fs from "fs";

cloudinary.config({
    cloud_name: config.cloudinary_cloud_name,
    api_key: config.cloudinary_api_key,
    api_secret: config.cloudinary_api_secret
});

const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, process.cwd() + "/uploads/")
    },
    filename: function (req, file, cb) {
        const uniqueSuffix = Date.now() + "-" + Math.round(Math.random() * 1E9);
        cb(null, file.fieldname + "-" + uniqueSuffix);
    }
});
export const upload = multer({ storage });

const uploadImage = (imagePath: string, imageName: string) => {
    return new Promise((resolve, reject) => {
        cloudinary.uploader.upload(imagePath, { public_id: imageName }, (err, res) => {
            if (err) {
                reject(err);
            }
            resolve(res);

            // delete image
            fs.unlink(imagePath, (err) => reject(err));
        });
    });
};

export default uploadImage;
