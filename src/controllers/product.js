// Require Schema from Model..
const Product = require("../models/product");

exports.addSingleProduct = async (req, res, next) => {
	try {
		const data = req.body;
		const dataExists = await Product.findOne({
			productSlug: data.productSlug,
		}).lean();

		if (dataExists) {
			const error = new Error("A product with this name/slug already exists");
			error.statusCode = 406;
			next(error);
		} else {
			const product = new Product(data);

			const productRes = await product.save();

			res.status(200).json({
				response: productRes,
				message: "Product Added Successfully!",
			});
		}
	} catch (err) {
		console.log(err);
		if (!err.statusCode) {
			err.statusCode = 500;
			err.message = "Something went wrong in the database operation!";
		}
		next(err);
	}
};

exports.getAllProducts = async (req, res, next) => {
	try {
		let filter = req.body.filter;

		let queryData;

		if (filter) {
			queryData = Product.find({ ...filter });
		} else {
			queryData = Product.find();
		}

		const data = await queryData
			.populate("brand")
			.populate("category")
			.populate("subCategory")
			.select(
				"productName images productSlug price discountAmount category brand sku quantity"
			);

		if (filter) {
			dataCount = await Product.countDocuments(filter);
		} else {
			dataCount = await Product.countDocuments();
		}

		res.status(200).json({
			data: data,
			count: dataCount,
		});
	} catch (err) {
		console.log(err);
		if (!err.statusCode) {
			err.statusCode = 500;
			err.message = "Something went wrong in the database operation!";
		}
		next(err);
	}
};

exports.getSingleProductById = async (req, res, next) => {
	const id = req.params.id;

	try {
		const query = { _id: id };
		const data = await Product.findOne(query);

		res.status(200).json({
			data: data,
			message: "Product fetched Successfully!",
		});
	} catch (err) {
		if (!err.statusCode) {
			err.statusCode = 500;
			err.message = "Something went wrong in the database operation!";
		}
		next(err);
	}
};

exports.updateProductById = async (req, res, next) => {
	const data = req.body;
	const params = req.params;

	// let filter;

	// filter = { id: params.id };

	// //Find the product
	// Product.findOne(filter).then((product) => {
	// 	if (!product) {
	// 		const error = new Error("Product could not be found!");
	// 		error.statusCode = 401;
	// 		next(error);
	// 		return;
	// 	}

	try {
		await Product.findOneAndUpdate({ _id: params.id }, { $set: data });

		res.status(200).json({
			message: "Product updated successfully!",
		});
	} catch (err) {
		console.log(err);
		if (!err.statusCode) {
			err.statusCode = 500;
			err.message = "Something went wrong in the database operation!";
		}
		next(err);
	}
	// });
};

exports.deleteProductById = async (req, res, next) => {
	const productId = req.params.id;

	// let filter;

	// filter = { id: productId };

	// //Find the product
	// Product.findOne(filter).then((product) => {
	// 	if (!product) {
	// 		const error = new Error("Product could not be found!");
	// 		error.statusCode = 401;
	// 		next(error);
	// 		return;
	// 	}

	try {
		const query = { _id: productId };
		await Product.deleteOne(query);

		res.status(200).json({
			message: "Product deleted successfully!",
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
