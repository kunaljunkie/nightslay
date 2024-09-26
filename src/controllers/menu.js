const restaurants_model = require("../models/restaurant");
const cloudinary = require("./cloudinary");
const ErrorHandling = require("../servives/service");
const restaurantMenu = require("../models/restaurant_menu");
const restaurant_review = require("../models/restaurant_review");
const ActivityPost = require("../models/restaurant_activity");
const restaurant_Event = require("../models/restaurant_events");

exports.upsertRestaurantMenu = ErrorHandling(async (req, res) => {
    const { restaurantId, categories, menuName, type, isPublish, description } =
      req.body;
    if (restaurantId) {
      const menu = new restaurantMenu({
        restaurantId,
        menuName,
        type,
        isPublish,
        description,
        categories,
      });
  
      const data = await menu.save();
      if (data) {
        res.status(200).json({ data: data, message: "Menu Added" });
      } else {
        res.status(200).json({ data: data, message: "unable to add menu" });
      }
      // }
    } else {
      res.status(200).json({ message: "restaurant missing" });
    }
  });
  
  exports.getRestaurantMenu = ErrorHandling(async (req, res) => {
    const { restaurantid } = req.query;
    if (restaurantid) {
      const data = await restaurantMenu.find({
        restaurantId: restaurantid,
        deletedAt: null,
      });
      if (data) {
        res.status(200).json({ data: data, message: "Data found" });
      } else {
        res
          .status(400)
          .json({ data: data, message: "Data not found of this restaurant" });
      }
    } else {
      res.status(400).json({ message: "restaurant missing" });
    }
  });
  exports.getRestaurantMenubyid = ErrorHandling(async (req, res) => {
    const { id } = req.query;
    if (id) {
      const data = await restaurantMenu.findOne({ _id: id, deletedAt: null });
      if (data) {
        res.status(200).json({ data: data, message: "Data found" });
      } else {
        res
          .status(400)
          .json({ data: data, message: "Data not found of this id" });
      }
    } else {
      res.status(400).json({ message: "id missing" });
    }
  });
  
  exports.updateRestaurantMenu = ErrorHandling(async (req, res) => {
    const { id, restaurantId, categoryId, itemId, updateData } = req.body;
    if (restaurantId) {
      let menu = await restaurantMenu.findOne({
        restaurantId: restaurantId,
        _id: id,
        deletedAt: null,
      });
      if (!menu) {
        return res.status(404).send("Menu not found for this restaurant.");
      }
      if (categoryId) {
        const category = menu.categories.id(categoryId);
        if (!category) {
          return res.status(404).send("Category not found.");
        }
  
        if (updateData.categoryName) {
          category.name = updateData.categoryName;
        }
        if (itemId) {
          const item = category.items.id(itemId);
          if (!item) {
            return res.status(404).send("Item not found.");
          }
  
          if (updateData.name) item.name = updateData.name;
          if (updateData.description) item.description = updateData.description;
          if (updateData.price) item.price = updateData.price;
          if (updateData.isVegetarian !== undefined)
            item.isVegetarian = updateData.isVegetarian;
          if (updateData.isAvailable !== undefined)
            item.isAvailable = updateData.isAvailable;
        }
      } else {
        const { status, menuName, type, isPublish, description } = req.body;
        menu.status = status;
        menu.menuName = menuName;
        menu.type = type;
        menu.isPublish = isPublish;
        menu.description = description;
      }
      const data = await restaurantMenu.updateOne(
        { _id: id, restaurantId: restaurantId, deletedAt: null },
        menu,
        { new: true }
      );
  
      if (data) {
        res.status(200).json({ data: data, message: "Menu updated" });
      } else {
        res.status(200).json({ data: data, message: "unable to update menu" });
      }
    } else {
      res.status(400).json({ message: "restaurant missing" });
    }
  });
  
  exports.deleteMenu = ErrorHandling(async (req, res) => {
    const { id } = req.query;
    if (!id) {
      res.status(400).json({ message: "id missing", event });
    }
    const data = await restaurantMenu.findByIdAndUpdate(
      id,
      { deletedAt: Date.now() },
      { new: true }
    );
    if (!data) {
      res.status(400).json({ message: "menu not found" });
    } else {
      res.status(400).json({ message: "menu delted succesfully", data: data });
    }
  });