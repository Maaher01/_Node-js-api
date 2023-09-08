// Require Main Modules..
const { validationResult } = require("express-validator");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
// Require Schema from Models..
const Admin = require("../models/admin");

exports.adminSignUp = async (req, res, next) => {
	const errors = validationResult(req);

	if (!errors.isEmpty()) {
		const error = new Error(
			"Input Validation Error! Please complete required information."
		);
		error.statusCode = 422;
		error.data = errors.array();
		next(error);
		return;
	}

	try {
		const bodyData = req.body;

		delete bodyData.confirmPassword;

		const password = bodyData.password;
		const hashedPass = bcrypt.hashSync(password, 8);

		const user = new Admin({ ...bodyData, ...{ password: hashedPass } });

		const usernameExists = await Admin.findOne({
			username: bodyData.username,
		}).lean();

		if (usernameExists) {
			const error = new Error("A admin with this username already registered!");
			error.statusCode = 406;
			next(error);
		} else {
			const phoneExists = await Admin.findOne({
				phoneNo: bodyData.phoneNo,
			}).lean();
			if (phoneExists) {
				const error = new Error(
					"An admin with this phone number already registered!"
				);
				error.statusCode = 406;
				next(error);
			} else {
				const newUser = await user.save();
				res.status(200).json({
					message: "Admin Registration Successfull!",
					userId: newUser._id,
				});
			}
		}
	} catch (err) {
		console.log(err);
		if (!err.statusCode) {
			err.statusCode = 500;
			err.message = "Something went wrong on database operation!";
		}
		next(err);
	}
};

exports.adminLogin = async (req, res, next) => {
	const username = req.body.username;
	const password = req.body.password;

	let loadedAdmin;
	let token;

	try {
		const query = {
			//  $or: [
			//     {
			username: username,
			//     },
			//     {
			//       email: credential,
			//     },
			//   ],
		};
		const admin = await Admin.findOne(query);
		if (!admin) {
			const error = new Error(
				"An admin with this phone or email could not be found!"
			);
			error.statusCode = 404;
			next(error);
		} else if (admin.hasAccess === false) {
			const error = new Error(
				"Permission Denied. Please contact a higher authorized person."
			);
			error.statusCode = 401;
			next(error);
		} else {
			loadedAdmin = admin;
			const isEqual = bcrypt.compareSync(password, admin.password);

			if (!isEqual) {
				const error = new Error("You entered a wrong password!");
				error.statusCode = 401;
				next(error);
			} else {
				// For Json Token Generation
				token = jwt.sign(
					{
						username: loadedAdmin.username,
						email: loadedAdmin.email,
						userId: loadedAdmin._id,
					},
					process.env.JWT_PRIVATE_KEY_ADMIN,
					{
						expiresIn: "24h",
					}
				);

				res.status(200).json({
					token: token,
					expiredIn: 86400,
				});
			}
		}
	} catch (err) {
		if (!err.statusCode) {
			err.statusCode = 500;
			err.message = "Something went wrong on database operation!";
		}
		console.log(err);
		next(err);
	}
};

exports.getLoginAdminInfo = async (req, res, next) => {
	try {
		const loginUserId = req.adminData.userId;
		const result = await Admin.findOne({ _id: loginUserId }).select(
			"-password"
		);

		res.status(200).json({
			data: result,
			message: "Successfully got admin info.",
		});
	} catch (err) {
		if (!err.statusCode) {
			err.statusCode = 500;
			err.message = "Something went wrong in the database operation!";
		}
		next(err);
	}
};

exports.getAdminLists = async (req, res, next) => {
	try {
		const result = await Admin.find().select("-password");

		res.status(200).json({
			data: result,
			message: "Successfully got admin info.",
		});
	} catch (err) {
		if (!err.statusCode) {
			err.statusCode = 500;
			err.message = "Something went wrong on database operation!";
		}
		next(err);
	}
};

exports.forgotAdminPassword = async (req, res, next) => {
	const { username, newPassword } = req.body;

	let filter;

	filter = { username: username };

	//Find the admin
	Admin.findOne(filter).then((admin) => {
		if (!admin) {
			const error = new Error(
				"An admin with this username could not be found!"
			);
			error.statusCode = 401;
			next(error);
			return;
		}
		const hashedPass = bcrypt.hashSync(newPassword, 6);

		try {
			admin.password = hashedPass;
			admin.save();
			res.status(200).json({
				message: "Password changed successfully!",
			});
		} catch (err) {
			if (!err.statusCode) {
				err.statusCode = 500;
				err.message = "Something went wrong in the database operation!";
			}
		}
	});
};

exports.updateAdminById = async (req, res, next) => {
	const data = req.body;
	const params = req.params;

	// let filter;

	// filter = { id: params.id };

	// //Find the product
	// User.findOne(filter).then((user) => {
	// 	if (!user) {
	// 		const error = new Error("User could not be found!");
	// 		error.statusCode = 401;
	// 		next(error);
	// 		return;
	// 	}

	try {
		await Admin.findOneAndUpdate({ _id: params.id }, { $set: data });

		res.status(200).json({
			message: "Admin updated successfully!",
		});
	} catch (err) {
		console.log(err);
		if (!err.statusCode) {
			err.statusCode = 500;
			err.message = "Something went wrong in the database operation!";
		}
		next(err);
	}
	// });
};

exports.deleteAdminById = async (req, res, next) => {
	const itemId = req.params.id;

	// let filter;

	// filter = { id: itemId };

	// // Find the admin
	// Admin.findOne(filter).then((admin) => {
	// 	if (!admin) {
	// 		const error = new Error("Admin could not be found!");
	// 		error.statusCode = 401;
	// 		next(error);
	// 		return;
	// 	}

	try {
		const query = { _id: itemId };
		await Admin.deleteOne(query);

		res.status(200).json({
			message: "Data deleted successfully!",
		});
	} catch (err) {
		if (!err.statusCode) {
			err.statusCode = 500;
			err.message = "Something went wrong in the database operation!";
		}
		next(err);
	}
	// });
};
