// Require Schema from Model
const ProductBrand = require("../models/product-brand");

exports.addBrand = async (req, res, next) => {
	try {
		const data = req.body;
		const dataExists = await ProductBrand.findOne({
			brandName: data.brandName,
		});

		if (dataExists) {
			const error = new Error("A brand with this name already exists");
			error.statusCode = 406;
			next(error);
		} else {
			const productBrand = new ProductBrand(data);
			const response = await productBrand.save();

			return res.status(200).json({
				data: response,
				message: "Product Brand Added Successfully!",
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

exports.getAllBrand = async (req, res, next) => {
	try {
		const query = await ProductBrand.find();

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
