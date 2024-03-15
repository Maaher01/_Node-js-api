const jwt = require("jsonwebtoken");

module.exports = (req, res, next) => {
	const authHeader = req.get("Authorization");

	if (!authHeader) {
		const error = new Error("Sorry! you are not an administrator.");
		error.statusCode = 401;
		throw error;
	}
	const token = authHeader.split(" ")[1];
	let decodedToken;
	try {
		decodedToken = jwt.verify(token, process.env.ACCESS_TOKEN_SECRET_ADMIN);
		req.adminData = {
			username: decodedToken.AdminInfo.username,
			email: decodedToken.AdminInfo.email,
			userId: decodedToken.AdminInfo.userId,
		};
	} catch (err) {
		err.statusCode = 500;
		throw err;
	}
	if (!decodedToken) {
		const error = new Error("Administrator Error!");
		error.statusCode = 401;
		throw error;
	}
	req.adminId = decodedToken.adminId;
	next();
};
