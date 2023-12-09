const express = require("express");

// Created require files...
const controller = require("../controllers/product-sub-category");

// Get Express Router Function
const router = express.Router();

/**
 * /api/product
 * http://localhost:3000/api/product-sub-category
 */

router.post("/add-sub-category", controller.addSubCategory);
router.get("/get-all-sub-categories", controller.getAllSubCategory);

// Export all routers...
module.exports = router;
