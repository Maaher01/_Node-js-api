const express = require("express");

// Created require files...
const controller = require("../controllers/product-category");
const checkAdminAuth = require('../middleware/check-admin-auth');

// Get Express Router Function
const router = express.Router();

/**
 * /api/product
 * http://localhost:3000/api/product-category
 */

router.post("/add-category", checkAdminAuth, controller.addCategory);
router.get('/get-all-categories', controller.getAllCategory);

// Export all routers...
module.exports = router;
