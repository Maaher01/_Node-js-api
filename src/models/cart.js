const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const cartSchema = new Schema(
	{
		userId: {
			type: Schema.Types.ObjectId,
			ref: "User",
			required: true,
		},
		cartProducts: [
			{
				product: {
					type: Schema.Types.ObjectId,
					ref: "Product",
					required: true,
				},
				productQuantity: {
					type: Number,
					default: 1,
				},
				totalProductPrice: {
					type: Number,
					default: 0
				}
			},
		],
		totalPrice: {
			type: Number,
			default: 0
		},
		totalQuantity: {
			type: Number,
			default: 0
		}
	},
	{
		timestamps: true,
	}
);

module.exports = mongoose.model("Cart", cartSchema);
