const express = require("express");

const controller = require("../controller/cart");

const router = express.Router();

/**
 * /api/cart
 * http://localhost:3000/api/cart
 */

router.post("/", controller.addItemToCart);
