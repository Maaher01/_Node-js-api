const mongoose = require("mongoose");

/**
 * MongoDB Connection
 */
const databaseConnection = async () => {
	mongoose
		.connect(process.env.DATABASE_URI)
		.then(() => {
			console.info("Connected to MongoDB...");
		})
		.catch((err) => {
			console.error("Oops! Could not connect to MongoDB Cluster", err);
		});
};

module.exports = databaseConnection;
