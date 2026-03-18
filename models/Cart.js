
const mongoose = require("mongoose");

const CartSchema = new mongoose.Schema({
  user_id:{type:mongoose.Schema.Types.ObjectId,ref:"User"},
  product_id:{type:mongoose.Schema.Types.ObjectId,ref:"Product"},
  quantity:Number
});

module.exports = mongoose.model("Cart",CartSchema);
