const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const productBrandSchema = new Schema(
	{
		brandName: {
			type: String,
			required: true,
		},
		image: {
			type: String,
			required: false,
		},
	},
	{
		timestamps: true,
	}
);

module.exports = mongoose.model("ProductBrand", productBrandSchema);
