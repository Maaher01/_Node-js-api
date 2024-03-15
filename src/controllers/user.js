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

exports.userLogin = async (req, res, next) => {
	const email = req.body.email;
	const password = req.body.password;

	if (!email || !password) {
		res.status(400).json({
			message: "Email and password are required",
		});
	}

	let filter;
	let loadedUser;

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
		.then(async (isEqual) => {
			if (!isEqual) {
				const error = new Error("You entered a wrong password!");
				error.statusCode = 401;
				next(error);
				return;
			}
			// For Json Token Generation..
			const accessToken = jwt.sign(
				{
					UserInfo: {
						email: loadedUser.email,
						userId: loadedUser._id,
					},
				},
				process.env.ACCESS_TOKEN_SECRET_USER,
				{
					expiresIn: "10s",
				}
			);
			const refreshToken = jwt.sign(
				{
					email: loadedUser.email,
					userId: loadedUser._id,
				},
				process.env.REFRESH_TOKEN_SECRET_USER,
				{
					expiresIn: "1d",
				}
			);
			// Saving refreshToken with current user
			loadedUser.refreshToken = refreshToken;
			const result = await loadedUser.save();

			// Creates Secure Cookie with refresh token
			res.cookie("jwt", refreshToken, {
				httpOnly: true,
				secure: true,
				sameSite: "None",
				maxAge: 24 * 60 * 60 * 1000,
			});

			res.status(200).json({
				token: accessToken,
			});
		})
		.catch((err) => {
			if (!err.statusCode) {
				err.statusCode = 500;
				err.message = "Something went wrong on database operation!";
			}
			next(err);
		});
};

exports.userLogout = async (req, res) => {
	const cookies = req.cookies;
	if (!cookies?.jwt) return res.sendStatus(204);
	const refreshToken = cookies.jwt;

	const foundUser = await User.findOne({ refreshToken }).exec();

	if (!foundUser) {
		res.clearCookie("jwt", { httpOnly: true, sameSite: "None", secure: true });
		return res.sendStatus(204);
	}

	//Delete user's refresh token
	foundUser.refreshToken = "";
	const result = await foundUser.save();

	res.clearCookie("jwt", { httpOnly: true, sameSite: "None", secure: true });
	res.sendStatus(204);
};

exports.userRefreshToken = async (req, res) => {
	const cookies = req.cookies;
	if (!cookies?.jwt) return res.sendStatus(401);
	const refreshToken = cookies.jwt;

	const foundUser = await User.findOne({ refreshToken }).exec();
	if (!foundUser) return res.status(403);

	//Evaluate jwt
	jwt.verify(
		refreshToken,
		process.env.REFRESH_TOKEN_SECRET_USER,
		(err, decoded) => {
			if (err || foundUser.email !== decoded.email) return res.sendStatus(403);
			const accessToken = jwt.sign(
				{
					UserInfo: {
						email: foundUser.email,
						userId: foundUser._id,
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

	let filter;

	filter = { id: itemId };

	//Find the user
	// User.findOne(filter).then((user) => {
	// 	if (!user) {
	// 		const error = new Error("User could not be found!");
	// 		error.statusCode = 401;
	// 		next(error);
	// 		return;
	// 	}

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
	// });
};

exports.updateUserById = async (req, res, next) => {
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
		await User.findOneAndUpdate({ _id: params.id }, { $set: data });

		res.status(200).json({
			message: "User updated successfully!",
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

exports.getLoginUserInfo = async (req, res, next) => {
	try {
		const loginUserId = req.userData.userId;
		const data = await User.findOne({ _id: loginUserId }).select("-password");

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
		const users = await User.find().select("-password -carts");

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
