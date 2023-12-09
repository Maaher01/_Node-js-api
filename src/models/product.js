const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const productSchema = new Schema(
	{
		productName: {
			type: String,
			required: true,
		},
		productSlug: {
			type: String,
			required: true,
		},
		sku: {
			type: String,
			required: false,
		},
		images: [
			{
				type: String,
				required: false,
			},
		],
		price: {
			type: Number,
			required: true,
		},
		discountAmount: {
			type: Number,
			required: false,
		},
		quantity: {
			type: Number,
			default: 0,
			required: false,
		},
		soldQuantity: {
			type: Number,
			default: 0,
			required: false,
		},
		brand: {
			type: Schema.Types.ObjectId,
			ref: "ProductBrand",
			required: false,
		},
		brandName: {
			type: String,
		},
		category: {
			type: Schema.Types.ObjectId,
			ref: "ProductCategory",
			required: true,
		},
		categoryName: {
			type: String,
		},
		subCategory: {
			type: Schema.Types.ObjectId,
			ref: "ProductSubCategory",
			required: true,
		},
		subCategoryName: {
			type: String,
		},
		shortDescription: {
			type: String,
			required: false,
		},
	},
	{
		versionKey: false,
		timestamps: true,
	}
);

module.exports = mongoose.model("Product", productSchema);
