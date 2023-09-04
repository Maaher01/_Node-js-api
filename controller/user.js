// Require Main Modules..
const { validationResult } = require("express-validator");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
// Require Post Schema from Model..
const User = require("../models/user");

exports.userRegistration = async (req, res, next) => {
	const errors = validationResult(req);
	// Check Input validation Error with Error Handler..
	if (!errors.isEmpty()) {
		const error = new Error(
			"Input Validation Error! Please complete required information."
		);
		error.statusCode = 422;
		error.data = errors.array();
		next(error);
		return;
	}

	// Main..
	const bodyData = req.body;

	const password = bodyData.password;
	const hashedPass = bcrypt.hashSync(password, 6);

	const registrationData = { ...bodyData, ...{ password: hashedPass } };

	const user = new User(registrationData);

	User.findOne({
		phoneNo: bodyData.phoneNo,
	})
		.then((userExists) => {
			if (userExists) {
				const error = new Error(
					"A user with this phone no. is already registered!"
				);
				error.statusCode = 401;
				throw error;
			} else {
				return user.save();
			}
		})
		.then((newUser) => {
			res.status(200).json({
				message: "User Registration Successfull!",
				userId: newUser._id,
			});
		})
		.catch((err) => {
			if (!err.statusCode) {
				err.statusCode = 500;
			}
			next(err);
		});
};

exports.userLogin = (req, res, next) => {
	const email = req.body.email;
	const password = req.body.password;

	let filter;
	let loadedUser;
	let token;

	filter = { email: email };

	// For finding account for login..
	User.findOne(filter)
		.then((user) => {
			if (!user) {
				const error = new Error("A user with this email could not be found!");
				error.statusCode = 401;
				next(error);
				return;
			}
			loadedUser = user;
			return bcrypt.compareSync(password, user.password);
		})
		.then((isEqual) => {
			if (!isEqual) {
				const error = new Error("You entered a wrong password!");
				error.statusCode = 401;
				next(error);
				return;
			}
			// For Json Token Generation..
			token = jwt.sign(
				{
					email: loadedUser.email,
					userId: loadedUser._id,
				},
				process.env.JWT_PRIVATE_KEY,
				{
					expiresIn: "24h",
				}
			);

			res.status(200).json({
				token: token,
				expiredIn: 86400,
			});
		})
		.catch((err) => {
			if (!err.statusCode) {
				err.statusCode = 500;
			}
			next(err);
		});
};

exports.forgotUserPassword = async (req, res, next) => {
	const { email, newPassword } = req.body;

	let filter;

	filter = { email: email };

	//Find the user
	User.findOne(filter).then((user) => {
		if (!user) {
			const error = new Error("A user with this email could not be found!");
			error.statusCode = 401;
			next(error);
			return;
		}
		const hashedPass = bcrypt.hashSync(newPassword, 6);

		try {
			user.password = hashedPass;
			user.save();
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

exports.deleteUserById = async (req, res, next) => {
	const itemId = req.params.id;

	try {
		const query = { _id: itemId };
		await User.deleteOne(query);

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
};

exports.getLoginUserInfo = async (req, res, next) => {
	try {
		const loginUserId = req.userData.userId;
		const selectString = req.query.select;

		let user;

		if (selectString) {
			user = User.findById(loginUserId).select(selectString);
		} else {
			user = User.findById(loginUserId).select("-password");
		}
		const data = await user;

		res.status(200).json({
			data: data,
			message: "Successfully got user info.",
		});
	} catch (err) {
		if (!err.statusCode) {
			err.statusCode = 500;
			err.message = "Something went wrong in the database operation!";
		}
		next(err);
	}
};

exports.getUserLists = async (req, res, next) => {
	try {
		const users = await User.find().select("-password -carts -checkouts");

		res.status(200).json({
			data: users,
			message: "Successfully got all user list.",
		});
	} catch (err) {
		if (!err.statusCode) {
			err.statusCode = 500;
			err.message = "Something went wrong in the database operation!";
		}
		next(err);
	}
};
