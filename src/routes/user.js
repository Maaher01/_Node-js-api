// Main Modules Required..
const express = require("express");

const controller = require("../controllers/user");
const inputValidator = require("../validation/user");
const checkUserAuth = require("../middleware/check-user-auth");

const router = express.Router();

/**
 * /api/user
 * http://localhost:3000/api/user
 */

router.post(
	"/registration",
	inputValidator.checkUserRegInput,
	controller.userRegistration
);
router.post("/login", controller.userLogin);
router.patch("/forgot-password", controller.forgotUserPassword);
router.delete("/delete-user-by-id/:id", controller.deleteUserById);
router.put("/edit-user-by-id/:id", controller.updateUserById);
router.get("/logged-in-user-data", checkUserAuth, controller.getLoginUserInfo);
router.get("/get-all-user-list", controller.getUserLists);

// Export all router..
module.exports = router;
