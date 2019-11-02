const express  = require("express");
const path = require("path");
const router = express.Router();

/** CUSTOM IMPORTS */
const rootDir = require("../utils/path");
const producsController = require("../controllers/products");

router.get('/products/:productId',producsController.getProductDetails);

router.get('/',producsController.getProducts);

module.exports = router;