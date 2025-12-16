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

    const filePath = 'testfold/testfile';

    const { data, error } = await supabase.storage.from('testbuck1').upload(filePath, req.file.buffer, {
        cacheControl: '3600',
        upsert: false,
        // contentType: 'image/png',
        contentType: req.file.mimetype
    });
    if(error){
      console.log("Error on uploading to supabase", error);
    } else {
      const { data, error } = await supabase.storage.from('testbuck1').getPublicUrl(filePath);
      if(error){
        console.log("Error on retrieving public url", error)
      } else {
        console.log("Showing public url");
        await queries.createFileData(parseInt(req.body.parentFolderId), req.body.textInput, req.file.size.toString() , data.publicUrl);
      }
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

      // Get bucket needs policies in RLS policies?
      // const { data, error } = await supabase.storage.getBucket('testbuck1');
      // const { data, error } = await supabase.storage.listBuckets();

      // Tried using a bucket with no set policies, only public
      // const { data, error } = await supabase.storage.from('bucknopol').getPublicUrl('testy/flexboxcheatsheet.png');

      // Uploading
      // const { data, error } = await supabase.storage.from('testbuck1').upload('testfold/testing1.png', req.file.buffer, {
      //   cacheControl: '3600',
      //   upsert: false,
      //   // contentType: 'image/png',
      //   contentType: req.file.mimetype
      // });
      // console.log(error);
      // console.log(data);
      

      // Retrieve / GET
      // const { data, error } = await supabase.storage.from('testbuck1').getPublicUrl('testfold/testing1.png');
      // console.log(error);
      // console.log(data);

      // Listing files 
      // console.log(data);
      // console.log(error);

      // Check if file exists
      // const { data, error } = await supabase.storage.from('testbuck1').exists('testfold/testing1.png');
      // console.log(error);
      // console.log(data);

      // Delete
      // const { data, error } = await supabase.storage.from('testbuck1').remove(['testfold/test.png']);
      // console.log(error);
      // console.log(data);

    // res.send("aa");
  },
];

// Get Route
