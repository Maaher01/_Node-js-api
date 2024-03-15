// Require Schema from Model
const ProductCategory = require("../models/product-category");

exports.addCategory = async (req, res, next) => {
	try {
		const data = req.body;
		const dataExists = await ProductCategory.findOne({
			categoryName: data.categoryName,
		});

		if (dataExists) {
			const error = new Error(
				"A product category with this name already exists"
			);
			error.statusCode = 406;
			next(error);
		} else {
			const productCategory = new ProductCategory(data);
			const response = await productCategory.save();

			return res.status(200).json({
				data: response,
				message: "Product category Added Successfully!",
			});
		}
	} catch (err) {
		if (!err.statusCode) {
			(err.statusCode = 500),
				(err.message = "Something went wrong in the database operation!");
		}
		next(err);
	}
};

exports.getAllCategory = async (req, res, next) => {
	try {
		const query = await ProductCategory.find();

		const data = await query;

		return res.status(200).json({
			data: data,
		});
	} catch {
		if (!err.statusCode) {
			(err.statusCode = 500),
				(err.message = "Something went wrong in the database operation!");
		}
		next(err);
	}
};
