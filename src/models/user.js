const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const userSchema = new Schema(
	{
		fullName: {
			type: String,
			required: true,
		},
		address: {
			type: String,
			required: true,
		},
		phoneNo: {
			type: String,
			required: true,
		},
		email: {
			type: String,
			required: false,
		},
		gender: {
			type: String,
			required: true,
		},
		password: {
			type: String,
			required: true,
		},
		refreshToken: String,
		carts: [
			{
				type: Schema.Types.ObjectId,
				ref: "Cart",
			},
		],
	},
	{
		timestamps: true,
	}
);

module.exports = mongoose.model("User", userSchema);
