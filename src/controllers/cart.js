// Require Schema from Models..
const Cart = require("../models/cart");
const User = require("../models/user");

exports.addToCart = async (req, res, next) => {
	const userId = req.body.userId;
	const productId = req.body.productId;

	const newData = {
		cartProducts: [{ product: productId }],
		userId,
		totalQuantity: 1,
	};
	try {
		const cartData = await Cart.findOne({ userId: userId });

		if (cartData) {
			const productExistIndex = cartData.cartProducts.findIndex(
				(item) => item.product.toString() === productId
			);

			if (productExistIndex !== -1) {
				cartData.cartProducts[productExistIndex].productQuantity += 1;
			} else {
				cartData.cartProducts.push({
					product: productId,
					productQuantity: 1,
				});

				cartData.totalQuantity += 1;
			}

			await cartData.save();

			res.status(200).json({
				data: cartData,
				message: "Successfully updated cart info.",
			});
		} else {
			const newCart = new Cart(newData);
			const saveCart = await newCart.save();

			await User.findOneAndUpdate(
				{ _id: userId },
				{ $push: { carts: saveCart._id } }
			);

			res.status(200).json({
				message: "Successfully added to cart.",
			});
		}
	} catch (err) {
		console.log(err);
		if (!err.statusCode) {
			err.statusCode = 500;
			err.message = "Something went wrong on database operation!";
		}
		next(err);
	}
};

exports.getUserCart = async (req, res, next) => {
	const userId = req.query.userId;

	try {
		const fData = await Cart.find({ userId: userId }).populate(
			"cartProducts.product",
			"productName images price"
		);

		const cartData = JSON.parse(JSON.stringify(fData));

		res.status(200).json({
			data: cartData,
			message: "Successfully got cart info.",
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

exports.removeFromCart = async (req, res, next) => {
	const userId = req.body.userId;
	const productId = req.body.productId;

	try {
		const cart = await Cart.findOne({ userId: userId });

		const productIndex = cart.cartProducts.findIndex(
			(item) => item.product.toString() === productId
		);

		if (productIndex !== -1) {
			if (cart.cartProducts[productIndex].productQuantity > 1) {
				cart.cartProducts[productIndex].productQuantity -= 1;
				await cart.save();
			} else if (cart.cartProducts[productIndex].productQuantity == 1) {
				cart.cartProducts[productIndex].productQuantity == 0;
				cart.deleteOne();

				await User.findOneAndUpdate(
					{ _id: userId },
					{
						$set: {
							carts: [],
						},
					}
				);
			}
		}

		res.status(200).json({
			data: cart,
			message: "Successfully updated cart info.",
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
