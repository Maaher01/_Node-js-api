const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const cartSchema = new Schema(
	{
		products: [
			{
				type: String,
				required: false,
			},
		],
		subTotal: {
			type: Number,
			required: false,
			default: 0,
		},
	},
	{
		timestamps: true,
	}
);

module.exports = mongoose.model("Cart", cartSchema);
