// Main Module Required..
const express = require("express");

const controller = require("../controllers/cart");
const checkUserAuth = require("../middleware/check-user-auth");

// Get Express Router Function..
const router = express.Router();

/**
 * /api/cart
 * http://localhost:3000/api/cart
 */

router.post("/add-to-cart", checkUserAuth, controller.addToCart);
router.get("/get-user-cart", controller.getUserCart);

// Export all routes..
module.exports = router;
