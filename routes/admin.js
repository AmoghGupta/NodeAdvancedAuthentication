const express  = require("express");
const path = require("path");
const router = express.Router();



/** CUSTOM IMPORTS */
const rootDir = require("../utils/path");
const producsController = require("../controllers/products");

router.get('/add-product',producsController.getAddProduct);


// will accept only incoming POST requests
router.post('/add-product', producsController.postAddProduct);

module.exports = router;

