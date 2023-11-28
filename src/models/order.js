const mongoose = require("mongoose")
const Schema = mongoose.Schema

const orderSchema = new Schema(
    {
        name: {
            type: String,
            required: true,
            trim: true
        },
        phoneNo: {
            type: String,
            required: true
        },
        city: {
            type: String,
            required: true
        },
        shippingAddress: {
            type: String,
            required: true
        },
        orderCart: {
            type: Schema.Types.ObjectId,
            ref: "Cart",
            required: true
        },
        deliveryCharge: {
            type: Number,
            required: true
        },
        orderDiscount: {
            type: Number,
            required: false,
            default: 401
        },
        checkoutDate: {
            type: Date,
            required: true
        },
        orderStatus: {
            type: Number,
            required: true,
            default: 1
        },
        note: {
            type: String,
            required: false
        },
        user: {
            type: Schema.Types.ObjectId,
            ref: "User",
            required: true
        }
    }, 
    {
        versionKey: false,
        timestamps: true
    }
)

module.exports = mongoose.model("Order", orderSchema)