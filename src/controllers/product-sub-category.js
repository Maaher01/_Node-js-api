// Require Schema from Model
const ProductSubCategory = require("../models/product-sub-category");

exports.addSubCategory = async (req, res, next) => {
	try {
		const data = req.body;
		const dataExists = await ProductSubCategory.findOne({
			subCategoryName: data.subCategoryName,
		});

		if (dataExists) {
			const error = new Error(
				"A product sub category with this name already exists"
			);
			error.statusCode = 406;
			next(error);
		} else {
			const productSubCategory = new ProductSubCategory(data);
			const response = await productSubCategory.save();

			return res.status(200).json({
				data: response,
				message: "Product sub category Added Successfully!",
			});
		}
	} catch (err) {
		console.log(err);
		if (!err.statusCode) {
			(err.statusCode = 500),
				(err.message = "Something went wrong in the database operation!");
		}
		next(err);
	}
};

exports.getAllSubCategory = async (req, res, next) => {
	try {
		const query = await ProductSubCategory.find();

		const data = await query;

		return res.status(200).json({
			data: data,
		});
	} catch {
		console.log(err);
		if (!err.statusCode) {
			(err.statusCode = 500),
				(err.message = "Something went wrong in the database operation!");
		}
		next(err);
	}
};
