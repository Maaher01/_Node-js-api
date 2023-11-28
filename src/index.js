/**
 * NODEJS API
 * DATABASE MONGODB
 */
const express = require("express");
require("dotenv").config();
const databaseConnection = require("./config/config");

// Cors Files..
const cors = require("cors");
const errorHandler = require("./middleware/error-handler");
const corsOptions = require("./middleware/check-ip-whitelist");

/**
 *  Router File Import
 */
const adminRoutes = require("./routes/admin");
const userRoutes = require("./routes/user");
const productRoutes = require("./routes/product");
const cartRoutes = require("./routes/cart");
const orderRoutes = require("./routes/order")
 
/**
 * MAIN APP CONFIG
 */
const app = express();

const port = process.env.PORT || 3000;

//Middlewares
app.use(express.json());
app.use(cors(corsOptions));

/**
 * MAIN BASE ROUTER WITH IMPORTED ROUTES
 */
app.use("/api/admin", adminRoutes);
app.use("/api/user", userRoutes);
app.use("/api/product", productRoutes);
app.use("/api/cart", cartRoutes);
app.use("/api/order", orderRoutes)

/**
 * MAIN BASE GET PATH
 */
app.get("/", (req, res) => {
	res.send(
		`<div style="width: 100%; height: 100vh; display: flex; flex-direction: column; align-items: center; justify-content: center">
			<h1 style="color: blueviolet">API RUNNING...</h1>
		</div>`
	);
});

/**
 * Error Handler
 */
app.use(errorHandler.route);
app.use(errorHandler.next);

/**
 * NODEJS SERVER START
 * MongoDB Connection
 */
app.listen(port, async () => {
	await databaseConnection();
	console.log(`Server is running at http://localhost:${port}`);
});
