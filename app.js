const express = require("express");
const mongoose = require("mongoose");
require("dotenv").config();

const cors = require("cors");
const errorHandler = require("./middileware/error-handler");
const corsOptions = require("./middileware/check-ip-whitelist");

// Router File Import
const adminRoutes = require("./routes/admin");
const userRoutes = require("./routes/user");
const productRoutes = require("./routes/product");

// MAIN APP CONFIG
const app = express();
app.use(express.json());
app.use(cors());

// MAIN BASE ROUTER WITH IMPORTED ROUTES
app.use("/api/admin", adminRoutes);
app.use("/api/user", userRoutes);
app.use("/api/product", productRoutes);

/**
 * MAIN BASE GET PATH
 */
app.get("/", (req, res) => {
	res.send(
		'<div style="width: 100%; height: 100vh; display: flex; flex-direction: column; align-items: center; justify-content: center"><h1 style="color: blueviolet">API RUNNING...</h1></div>'
	);
});

app.use(errorHandler.route);
app.use(errorHandler.next);

// MongoDB Connection
mongoose
	.connect("mongodb://127.0.0.1:27017/test")
	.then(() => {
		const port = process.env.PORT || 3000;
		app.listen(port, () =>
			console.log(`Server is running at http://localhost:${port} `)
		);
		console.log("Connected to mongoDB");
	})
	.catch((err) => {
		console.error("Oops! Could not connect to mongoDB Cluster0", err);
	});
