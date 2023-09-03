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

exports.insertManyProduct = async (req, res, next) => {
	try {
		const data = req.body;
		await Product.deleteMany({});
		const result = await Product.insertMany(data);

		res.status(200).json({
			message: `${
				result && result.length ? result.length : 0
			} Products imported successfully!`,
		});
	} catch (err) {
		console.log(err);
		if (!err.statusCode) {
			err.statusCode = 500;
			err.message = "Something went wrong in database operation!";
		}
		next(err);
	}
};

exports.getAllProducts = async (req, res, next) => {
	try {
		const queryData = Product.find();
		const data = await queryData;

		res.status(200).json({
			data: data,
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

exports.getProductsByDynamicSort = async (req, res, next) => {
	try {
		let paginate = req.body.paginate;
		let filter = req.body.filter;
		let sort = req.body.sort;
		let select = req.body.select;

		let queryDoc;
		let countDoc;

		// Filter
		if (filter) {
			queryDoc = Product.find(filter);
			countDoc = Product.countDocuments(filter);
		} else {
			queryDoc = Product.find();
			countDoc = Product.countDocuments();
		}

		// Sort
		if (sort) {
			queryDoc = queryDoc.sort(sort);
		}

		// Pagination
		if (paginate) {
			queryDoc
				.skip(Number(paginate.pageSize) * (Number(paginate.currentPage) - 1))
				.limit(Number(paginate.pageSize));
		}

		if (select) {
			queryDoc.select(select);
		}

		const data = await queryDoc;

		const count = await countDoc;

		res.status(200).json({
			data: data,
			count: count,
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

exports.getSingleProductBySlug = async (req, res, next) => {
	const productSlug = req.params.slug;

	try {
		const query = { productSlug: productSlug };
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
	try {
		await Product.findOneAndUpdate({ _id: data._id }, { $set: data });

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
};

exports.updateMultipleProductById = async (req, res, next) => {
	const data = req.body;
	try {
		data.forEach((m) => {
			Product.findByIdAndUpdate(
				m._id,
				{ $set: m },
				{ new: true, multi: true }
			).exec();
		});

		res.status(200).json({
			message: "Products updated successfully!",
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

exports.deleteProductById = async (req, res, next) => {
	const productId = req.params.id;

	try {
		const query = { _id: productId };
		await Product.deleteOne(query);
		await Review.deleteOne({ product: productId });

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
};