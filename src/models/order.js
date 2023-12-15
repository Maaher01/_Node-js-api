const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const orderSchema = new Schema(
	{
		orderInfo: [
			{
				name: {
					type: String,
					required: true,
					trim: true,
				},
				phoneNo: {
					type: String,
					required: true,
				},
				shippingAddress: {
					type: String,
					required: true,
				},
				paymentMethod: {
					type: String,
					required: true,
				},
				deliveryCharge: {
					type: Number,
					required: true,
				},
				checkoutDate: {
					type: Date,
					required: false,
				},
				orderStatus: {
					type: Number,
					required: true,
					default: 1,
				},
				note: {
					type: String,
					required: false,
				},
			},
		],
		userId: {
			type: Schema.Types.ObjectId,
			ref: "User",
			required: true,
		},
		orderCart: {
			type: Schema.Types.ObjectId,
			ref: "Cart",
			required: true,
		},
	},
	{
		versionKey: false,
		timestamps: true,
	}
);

module.exports = mongoose.model("Order", orderSchema);
