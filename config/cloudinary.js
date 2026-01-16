// Config file to use cloudinary package
require('dotenv').config();
const cloudinary = require('cloudinary').v2;

// import { v2 as cloudinary } from 'cloudinary';

cloudinary.config({
    cloud_name: 'dnonrqcmf',
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET,
})

module.exports = cloudinary;