// Main Module Required..
const express = require("express");

const controller = require("../controller/admin");
const inputValidator = require("../validation/admin");
const checkAdminAuth = require("../middileware/check-admin-auth");

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
router.get(
	"/get-logged-in-admin-info",
	checkAdminAuth,
	controller.getLoginAdminInfo
);
router.get("/get-all-admin-list", controller.getAdminLists);
router.get("/get-single-admin-by-id/:id", controller.getSingleAdminById);
router.delete(
	"/delete-admin-by-id/:id",
	// checkAdminAuth,
	controller.deleteAdminById
);
router.post("/edit-admin-data", checkAdminAuth, controller.editAdmin);
router.patch("/forgot-password", controller.forgotAdminPassword);

// Export all routes..
module.exports = router;
