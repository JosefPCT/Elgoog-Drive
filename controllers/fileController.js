const { body, validationResult, matchedData } = require("express-validator");

const queries = require("../db/queries");
const { isAuth } = require("./utils/authMiddleware");
const upload = require("../config/multer");
const cloudinary = require('../config/cloudinary');
const supabase = require('../config/supabase').supabase;

// Post Route

module.exports.fileNewPostRoute = [
  upload.single("uploaded_file"),
  async (req, res, next) => {
    console.log("Uploading a new file...");
    console.log(req.body);
    console.log("File object", req.file);

    if(!req.file){
      return res.status(400).json({ error: 'No file uploaded' });
    }

    // Cloudinary stuff

    // cloudinary.uploader.upload_stream({ resource_type: 'auto'}, (error, result) => {
    //   if(error) {
    //     console.log(error);
    //     return res.status(500).json({ error: 'Error uploading to Cloudinary'});
    //   }
    //   console.log('Uploaded to Cloudinary succesfully!');
    //   console.log('Results: ', result);
    //   console.log('Public_id: ', result.public_id);
    //   console.log('Secure Url: ', result.secure_url);
    //   res.json({ public_id: result.public_id, url: result.secure_url });
    // }).end(req.file.buffer);

    // Supabase
      // const { data } = supabase.storage.from('testbuck1').getPublicUrl('testfold/sunsetsmall.png');
      // console.log(data);

      const { data, error } = await supabase.storage.getBucket('testbuck1');
      // const { data, error } = await supabase.storage.listBuckets();
      console.log(data);
      console.log(error);


    // res.send("aa");
  },
];

// Get Route
