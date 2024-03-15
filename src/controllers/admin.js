// Require Main Modules..
const { validationResult } = require("express-validator");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
// Require Schema from Models..
const Admin = require("../models/admin");
const user = require("../models/user");

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

	if (!username || !password) {
		res.status(400).json({
			message: "Username and password are required",
		});
	}

	let loadedAdmin;

	try {
		const query = { username: username };

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
				const accessToken = jwt.sign(
					{
						AdminInfo: {
							username: loadedAdmin.username,
							email: loadedAdmin.email,
							userId: loadedAdmin._id,
						},
					},
					process.env.ACCESS_TOKEN_SECRET_ADMIN,
					{
						expiresIn: "10s",
					}
				);
				const refreshToken = jwt.sign(
					{
						username: loadedAdmin.username,
						email: loadedAdmin.email,
						userId: loadedAdmin._id,
					},
					process.env.REFRESH_TOKEN_SECRET_ADMIN,
					{
						expiresIn: "1d",
					}
				);
				// Saving refreshToken with current user
				loadedAdmin.refreshToken = refreshToken;
				const result = await loadedAdmin.save();

				// Creates Secure Cookie with refresh token
				res.cookie("jwt", refreshToken, {
					httpOnly: true,
					secure: true,
					sameSite: "None",
					maxAge: 24 * 60 * 60 * 1000,
				});

				res.status(200).json({
					token: accessToken,
					role: loadedAdmin.role,
				});
			}
		}
	} catch (err) {
		if (!err.statusCode) {
			err.statusCode = 500;
			err.message = "Something went wrong on database operation!";
		}
		next(err);
	}
};

exports.adminLogout = async (req, res) => {
	const cookies = req.cookies;
	if (!cookies?.jwt) return res.sendStatus(204);
	const refreshToken = cookies.jwt;

	const foundAdmin = await Admin.findOne({ refreshToken }).exec();

	if (!foundAdmin) {
		res.clearCookie("jwt", { httpOnly: true, sameSite: "None", secure: true });
		return res.sendStatus(204);
	}

	//Delete admin's refresh token
	foundAdmin.refreshToken = "";
	const result = await foundAdmin.save();

	res.clearCookie("jwt", { httpOnly: true, sameSite: "None", secure: true });
	res.sendStatus(204);
};

exports.adminRefreshToken = async (req, res) => {
	const cookies = req.cookies;
	if (!cookies?.jwt) return res.sendStatus(401);
	const refreshToken = cookies.jwt;

	const foundAdmin = await Admin.findOne({ refreshToken }).exec();
	if (!foundAdmin) return res.status(403);

	//Evaluate jwt
	jwt.verify(
		refreshToken,
		process.env.REFRESH_TOKEN_SECRET_ADMIN,
		(err, decoded) => {
			if (err || foundAdmin.username !== decoded.username)
				return res.sendStatus(403);
			const accessToken = jwt.sign(
				{
					AdminInfo: {
						username: foundAdmin.username,
						email: foundAdmin.email,
						userId: foundAdmin._id,
					},
				},
				process.env.ACCESS_TOKEN_SECRET_USER,
				{
					expiresIn: "10s",
				}
			);

			res.status(200).json({
				token: accessToken,
			});
		}
	);
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
