const express = require("express");
const router = express.Router();

const { isAuthticatedUser, authorizeRoles } = require("../middleware/auth");
const {
  newOrder,
  getSingleOrder,
  myOrder,
  getAllOrders,
  updateOrder,
  deleteOrder,
} = require("../controllers/orderController");

router.route("/order/new").post(isAuthticatedUser, newOrder);

router.route("/order/:id").get(isAuthticatedUser, getSingleOrder);

router.route("/orders/me").get(isAuthticatedUser, myOrder);

router
  .route("/admin/orders")
  .get(isAuthticatedUser, authorizeRoles("admin"), getAllOrders);

router
  .route("/admin/order/:id")
  .put(isAuthticatedUser, authorizeRoles("admin"), updateOrder)
  .delete(isAuthticatedUser, authorizeRoles("admin"), deleteOrder);

module.exports = router;
