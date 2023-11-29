//Main module required
const express = require("express")

const controller = require("../controllers/order")

// Get Express Router Function
const router = express.Router()

/**
 * /api/order
 * http:localhost:3000/api/order
 */

router.post("/add-order", controller.addOrder)
router.get("/get-user-orders", controller.getUserOrders)
router.get("/get-order-by-id/:id", controller.getOrderById)

module.exports = router