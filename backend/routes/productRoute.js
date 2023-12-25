const express = require("express");
const { getAllProducts,createProduct, updateProduct, deleteProduct, getProductDetails } = require("../controllers/productController");
const { isAuthUser } = require("../middleware/auth");

const router = express.Router();

router.route("/products").get(getAllProducts);

router.route("/product/new").post(isAuthUser , createProduct);

router.route("/product/:id").put(isAuthUser , updateProduct).delete(isAuthUser , deleteProduct).get(getProductDetails);

module.exports = router;