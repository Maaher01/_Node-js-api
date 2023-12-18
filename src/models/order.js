const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const orderSchema = new Schema(
	{
		// orderId: {
		// 	type: String,
		// 	required: false,
		// 	unique: true,
		// },
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
				paymentType: {
					type: String,
					required: true,
				},
				deliveryCharge: {
					type: Number,
					required: true,
				},
				note: {
					type: String,
					required: false,
				},
			},
		],
		paymentStatus: {
			type: String,
			required: true,
			default: "Unpaid",
		},
		orderedItems: [
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
			},
		],
		subTotal: {
			type: Number,
			required: true,
		},
		grandTotal: {
			type: Number,
			required: true,
		},
		checkoutDate: {
			type: Date,
			required: false,
		},
		orderStatus: {
			type: String,
			required: true,
			default: 1,
		},
		user: {
			type: Schema.Types.ObjectId,
			ref: "User",
			required: true,
		},
	},
	{
		versionKey: false,
		timestamps: true,
	}
);

module.exports = mongoose.model("Order", orderSchema);
