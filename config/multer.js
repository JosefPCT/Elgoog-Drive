const multer = require("multer");

const MAX_FILE_SIZE = 5 * 1024 * 1024; // 5mb

const storage = multer.memoryStorage();

const upload = multer({
  // dest: "uploads/",
  // fileFilter: fileFilter,
  storage: storage,
  limits: {
    fileSize: MAX_FILE_SIZE,
  },
});

function fileFilter(req, file, cb) {
  console.log("Inside filter function");
  // Show file object without destination, filename, path, and size properties
  console.log("req body", req.body);
  console.log("file object", file);

  // The function should call `cb` with a boolean
  // to indicate if the file should be accepted
  try {
    if (file.mimetype === "image/jpeg") {
      console.log("Gets uploaded in /uploads directory...");
      cb(null, true);
    } else {
      console.log("Does not get uploaded");
      cb(null, false);
    }
  } catch (error) {
    cb(new Error("I don\t have a clue!"));
  }
}

module.exports = upload;