// Main Module Required..
const express = require("express");

const controller = require("../controllers/cart");

// Get Express Router Function..
const router = express.Router();

/**
 * /api/cart
 * http://localhost:3000/api/cart
 */

router.post("/add-to-cart", controller.addToCart);
router.get("/get-user-cart", controller.getUserCart);

// Export all routes..
module.exports = router;
