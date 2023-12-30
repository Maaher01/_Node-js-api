const express = require("express");

// Created require files...
const controller = require("../controllers/product-brand");
const checkAdminAuth = require('../middleware/check-admin-auth');

// Get Express Router Function
const router = express.Router();

/**
 * /api/product
 * http://localhost:3000/api/product-brand
 */

router.post("/add-brand", checkAdminAuth, controller.addBrand);
router.get('/get-all-brands', controller.getAllBrand);

// Export all routers...
module.exports = router;
