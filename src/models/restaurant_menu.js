const mongoose = require("mongoose");

const ItemSchema = new mongoose.Schema({
  name: { type: String, required: true },
  description: { type: String, required: true },
  price: { type: Number, required: true },
  isVegetarian: { type: Boolean, default: false },
  isAvailable: { type: Boolean, default: true },
  picture: { type: String, default: null },
});

const CategorySchema = new mongoose.Schema({
  name: { type: String, required: true },
  description: { type: String },
  picture: { type: String, default: null },
  items: [ItemSchema],
});

const MenuSchema = new mongoose.Schema(
  {
    restaurantId: {
      type: mongoose.Schema.Types.ObjectId,
      required: true,
      ref: "Restaurant",
    },
    ownerId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "restaurant_owner",
    },
    status: { type: Boolean, default: true },
    menuName: { type: String, required: true },
    type: { type: String, required: true },
    isPublish:{ type: Boolean, default: false },
    description: { type: String, required: true },
    categories: [CategorySchema],
    deletedAt: { type: Date, default: null },
  },
  { timestamps: true }
);

const Menu = mongoose.model("restaurant_menu", MenuSchema);

module.exports = Menu;
