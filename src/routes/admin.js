// Main Module Required..
const express = require("express");

const controller = require("../controllers/admin");
const inputValidator = require("../validation/admin");
const checkAdminAuth = require("../middleware/check-admin-auth");

// Get Express Router Function..
const router = express.Router();

/**
 * /api/admin
 * http://localhost:3000/api/admin
 */

router.post(
	"/registration",
	inputValidator.checkAdminRegInput,
	controller.adminSignUp
);
router.put("/login", controller.adminLogin);
router.get("/logout", controller.adminLogout);
router.get("/refreshToken", controller.adminRefreshToken);
router.get(
	"/get-logged-in-admin-info",
	checkAdminAuth,
	controller.getLoginAdminInfo
);
router.get("/get-all-admin-list", checkAdminAuth, controller.getAdminLists);
//Modify
router.put("/edit-admin-by-id/:id", checkAdminAuth, controller.updateAdminById);
router.delete(
	"/delete-admin-by-id/:id",
	checkAdminAuth,
	controller.deleteAdminById
);
router.patch("/forgot-password", controller.forgotAdminPassword);

// Export all routes..
module.exports = router;
