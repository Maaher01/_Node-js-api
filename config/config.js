const mongoose = require("mongoose");

// MongoDB Connection
const databaseConnection = async () => {
	mongoose
		.connect("mongodb://127.0.0.1:27017/test")
		.then(() => {
			console.info("Connected to MongoDB");
		})
		.catch((err) => {
			console.error("Oops! Could not connect to MongoDB Cluster", err);
		});
};

module.exports = databaseConnection;
