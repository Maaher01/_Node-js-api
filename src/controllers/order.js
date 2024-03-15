// Require Schema for Models
const Order = require("../models/order");
const User = require("../models/user");
const Cart = require("../models/cart");
const Product = require("../models/product");

exports.addOrder = async (req, res, next) => {
	const user = req.body.user;
	const orderData = req.body;

	orderData.checkoutDate = new Date();

	try {
		if (user) {
			const cart = await Cart.findOne({ userId: user });

			orderData.subTotal = cart.grandTotal;

			orderData.grandTotal =
				Number(cart.grandTotal) + Number(orderData.orderInfo.deliveryCharge);

			orderData.orderedItems = cart.cartProducts.map((cartProduct) => ({
				product: cartProduct.product,
				productQuantity: cartProduct.productQuantity,
			}));

			for (const cartProduct of cart.cartProducts) {
				const product = await Product.findById(cartProduct.product);

				if (product) {
					product.soldQuantity += cartProduct.productQuantity;
					product.quantity -= cartProduct.productQuantity;

					product.save();
				}
			}

			await cart.delete();

			const userCart = await User.findOne({ _id: user });
			await userCart.updateOne({
				$set: {
					carts: [],
				},
			});
		}
		const data = { ...orderData };
		const newOrder = new Order(data);
		const saveOrder = await newOrder.save();

		res.status(200).json({
			data: saveOrder,
			message: "Order placed successfully.",
		});
	} catch (err) {
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
		const orders = await Order.find({ user: userId });

		const orderData = JSON.parse(JSON.stringify(orders));

		res.status(200).json({
			data: orderData,
			message: "Orders fetched successfully",
		});
	} catch (err) {
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
		const orderData = await Order.findById(orderId).populate(
			"orderedItems.product",
			"productName images categoryName subCategoryName brandName price"
		);

		res.status(200).json({
			data: orderData,
			message: "Order fetched successfully",
		});
	} catch (err) {
		if (!err.statusCode) {
			err.statusCode = 500;
			err.message = "Something went wrong in the database operation";
		}
		next(err);
	}
};
