const path = require("path");

//gives us the path to the file that makes our application run
module.exports = path.dirname(process.mainModule.filename);