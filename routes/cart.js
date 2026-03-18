
const express = require("express");
const Cart = require("../models/Cart");

const router = express.Router();

router.post("/add", async(req,res)=>{
  const cart = new Cart(req.body);
  await cart.save();
  res.json(cart);
});

router.get("/:userId", async(req,res)=>{
  const cart = await Cart.find({user_id:req.params.userId}).populate("product_id");
  res.json(cart);
});

module.exports = router;
