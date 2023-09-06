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
			default: 1,
			required: false,
		},
		brand: {
			type: String,
			required: false,
		},
	},
	{
		timestamps: true,
	}
);

module.exports = mongoose.model("Product", productSchema);
