const { createActiveityPost, getAllRestaurantActivityPost, getbyidPost, updateRestaurantPost, DeleteRestaurantPost } = require("../controllers/activity");
const { getallRestaurantEvent, getallRestaurantEventbyid, DeleteRestaurantEvent, updateRestaurantEvent, CreateRestaurantEvent } = require("../controllers/avent");
const { createuser, login } = require("../controllers/login");
const { upsertRestaurantMenu, getRestaurantMenu, getRestaurantMenubyid, updateRestaurantMenu, deleteMenu } = require("../controllers/menu");
const {
  insertRestaurant,
  getUserRestaurant,
  updateUSerRestaurant,
  submitReview,
  deleteRestaurant,
  getUserRestaurantbyid,
} = require("../controllers/restaurant");
const { respondToReview, restaurantReviews, updateReviewResposne, deleteReview } = require("../controllers/review");
const uploadImages = require("../middlewares/multer");
const requestLogger = require("../middlewares/reqReslogger");
const admin = require("express").Router();
admin.use(requestLogger);

admin.post(
  "/create-restaurant",
  // uploadImages.array("images", 4),
  insertRestaurant
);
admin.get("/get-user-restaurant", getUserRestaurant);
admin.get("/get-restaurant-byid", getUserRestaurantbyid);
admin.patch(
  "/update-user-restaurant",
  // uploadImages.array("images", 4),
  updateUSerRestaurant
);

admin.post("/update-add-restaurant-menu", upsertRestaurantMenu);
admin.get("/get-restaurant-menu", getRestaurantMenu);
admin.get("/getbyid-restaurant-menu", getRestaurantMenubyid);
admin.patch("/update-restaurant-menu-partial", updateRestaurantMenu);



admin.post("/response-restaurant-review", respondToReview);
admin.get("/get-restaurant-review", restaurantReviews);
admin.post(
  "/submit-restaurant-review",
  uploadImages.array("images", 4),
  submitReview
); // TODO: remove this
admin.patch("/update-response-restaurant-review", updateReviewResposne);
admin.post(
  "/create-post",
  uploadImages.array("images", 4),
  createActiveityPost
);
admin.get("/getall-post", getAllRestaurantActivityPost);
admin.get("/get-post-byid", getbyidPost);
admin.patch(
  "/update-post-restaurant",
  uploadImages.array("images", 4),
  updateRestaurantPost
);
admin.delete("/delete-post-restaurant", DeleteRestaurantPost);
admin.post(
  "/create-restaurant-event",
  uploadImages.array("images", 4),
  CreateRestaurantEvent
);
admin.get("/getall-restaurant-event", getallRestaurantEvent);
admin.get("/get-restaurant-event-byid", getallRestaurantEventbyid);
admin.delete("/delete-restaurant-event", DeleteRestaurantEvent);
admin.patch(
  "/update-restaurant-event",
  uploadImages.array("images", 4),
  updateRestaurantEvent
);
admin.delete("/delete-restaurant", deleteRestaurant);
admin.delete("/delete-restaurant-menu", deleteMenu);
admin.delete("/delete-restaurant-review", deleteReview);

admin.post("/create-owner", createuser);
admin.get("/login-owner", login);

module.exports = admin;
