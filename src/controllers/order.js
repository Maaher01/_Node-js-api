// Require Schema for Models
const Order = require("../models/order");
const User = require("../models/user");
const Cart = require("../models/cart");
const ObjectId = require("mongoose").Types.ObjectId;

exports.addOrder = async (req, res, next) => {
	const user = req.body.userId;
	const orderData = req.body;
	
	const mData = { ...orderData };
	const newOrder = new Order(mData);

	try {
		const saveOrder = await newOrder.save();

		if (user) {
			await Cart.deleteMany({ userId: new ObjectId(user) });

			await User.findOneAndUpdate(
				{ _id: user },
				{
					$set: {
						carts: [],
					},
				}
			);
		}

		res.status(200).json({
			data: saveOrder,
			message: "Order placed successfully.",
		});
	} catch (err) {
		console.log(err);
		if (!err.statusCode) {
			err.statusCode = 500;
			err.message = "Something went wrong on database operation!";
		}
		next(err);
	}
};

exports.getUserOrders = async (req, res, next) => {
	const userId = req.body.userId;

	try {
		const orders = await Order.find({ userId: userId });

		const orderData = JSON.parse(JSON.stringify(orders));

		res.status(200).json({
			data: orderData,
			message: "Orders fetched successfully",
		});
	} catch (err) {
		console.log(err);
		if (!err.statusCode) {
			err.statusCode = 500;
			err.message = "Something went wrong in the database operation";
		}
		next(err);
	}
};

exports.getOrderById = async (req, res, next) => {
	const orderId = req.params.id;

	try {
		const orderData = await Order.findById(orderId);

		res.status(200).json({
			data: orderData,
			message: "Order fetched successfully",
		});
	} catch (err) {
		console.log(err);
		if (!err.statusCode) {
			err.statusCode = 500;
			err.message = "Something went wrong in the database operation";
		}
		next(err);
	}
};
