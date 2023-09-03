const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const adminSchema = new Schema({
	email: {
		type: String,
		required: false,
	},
	username: {
		type: String,
		required: true,
	},
	password: {
		type: String,
		required: true,
	},
	name: {
		type: String,
		required: true,
	},
	phoneNo: {
		type: String,
		required: true,
	},
	role: {
		type: String,
		required: true,
	},
	hasAccess: {
		type: Boolean,
		required: true,
	},
});

module.exports = mongoose.model("Admin", adminSchema);
