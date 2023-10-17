const express = require("express");

// Created Require Files..
const controller = require("../controllers/product");
const checkAdminAuth = require("../middleware/check-admin-auth");

// Get Express Router Function..
const router = express.Router();

/**
 * /api/product
 * http://localhost:3000/api/product
 */

router.post("/add-single-product", checkAdminAuth, controller.addSingleProduct);
router.post("/get-all-products", controller.getAllProducts);
router.get("/get-single-product-by-id/:id", controller.getSingleProductById);

// Modify
router.put(
	"/edit-product-by-id/:id",
	checkAdminAuth,
	controller.updateProductById
);
router.delete(
	"/delete-product-by-id/:id",
	checkAdminAuth,
	controller.deleteProductById
);

// Export all routers..
module.exports = router;
