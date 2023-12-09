const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const productSubCategorySchema = new Schema(
	{
		category: {
			type: Schema.Types.ObjectId,
			ref: "ProductCategory",
			required: true,
		},
		subCategoryName: {
			type: String,
			required: true,
		},
		subCategoryImage: {
			type: String,
			required: false,
		},
	},
	{
		timestamps: true,
	}
);

module.exports = mongoose.model("ProductSubCategory", productSubCategorySchema);
