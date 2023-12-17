// Require Schema from Models..
const Cart = require("../models/cart");
const User = require("../models/user");
const Product = require("../models/product");

exports.addToCart = async (req, res, next) => {
	const userId = req.body.userId;
	const productId = req.body.productId;

	const product = await Product.findById(productId);

	const newData = {
		cartProducts: [{ product: product._id, totalProductPrice: product.price }],
		userId,
		totalQuantity: 1,
		grandTotal: product.price,
	};
	try {
		const cartData = await Cart.findOne({ userId: userId });

		if (cartData) {
			const productExistIndex = cartData.cartProducts.findIndex(
				(item) => item.product.toString() === productId
			);

			if (productExistIndex == -1) {
			cartData.cartProducts.push({
				product: product._id,
				productQuantity: 1,
				totalProductPrice: product.price,
			});

			cartData.totalQuantity += 1;
			cartData.grandTotal += product.price;
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

exports.increaseProductQuantity = async (req, res, next) => {
	const userId = req.body.userId;
	const productId = req.body.productId;

	const product = await Product.findById(productId);

	try {
		const cart = await Cart.findOne({ userId: userId });

		const productIndex = cart.cartProducts.findIndex(
			(item) => item.product.toString() === productId
		);

		const currentProduct = cart.cartProducts[productIndex];

		currentProduct.productQuantity += 1;
		currentProduct.totalProductPrice += product.price;
		cart.grandTotal += product.price;
		await cart.save();

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

exports.decreaseProductQuantity = async (req, res, next) => {
	const userId = req.body.userId;
	const productId = req.body.productId;

	const product = await Product.findById(productId);

	try {
		const cart = await Cart.findOne({ userId: userId });

		const productIndex = cart.cartProducts.findIndex(
			(item) => item.product.toString() === productId
		);

		const currentProduct = cart.cartProducts[productIndex];

		currentProduct.productQuantity -= 1;
		currentProduct.totalProductPrice -= product.price;
		cart.grandTotal -= product.price;
		await cart.save();

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

exports.removeFromCart = async (req, res, next) => {
	const userId = req.body.userId;
	const productId = req.body.productId;

	const product = await Product.findById(productId);

	try {
		const cart = await Cart.findOne({ userId: userId });

		const productIndex = cart.cartProducts.findIndex(
			(item) => item.product.toString() === productId
		);

		const currentProduct = cart.cartProducts[productIndex];

		if (cart.totalQuantity > 1) {
			cart.grandTotal -= product.price * currentProduct.productQuantity;
			cart.cartProducts.splice(productIndex, 1);
			cart.totalQuantity -= 1;
			await cart.save();
		} else {
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

exports.getUserCart = async (req, res, next) => {
	const userId = req.query.userId;

	try {
		const fData = await Cart.find({ userId: userId }).populate(
			"cartProducts.product",
			"productName images price discountAmount"
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
