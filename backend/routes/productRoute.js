const express = require("express");
const { getAllProducts, createProduct, updateProduct, deleteProduct, getProductDetails, createProductReivew, getProductReviews, deleteReivew, getAdminProducts } = require("../controllers/productController");
const { isAuthticatedUser,authorizeRoles } = require("../middleware/auth");

const router = express.Router();

router.route('/admin/products').get(isAuthticatedUser, authorizeRoles('admin'), getAdminProducts)

router.route('/products').get(getAllProducts);

router.route('/admin/product/new').post(isAuthticatedUser,authorizeRoles("admin"), createProduct);

router.route('/admin/product/:id').put(isAuthticatedUser,authorizeRoles("admin"), updateProduct).delete(isAuthticatedUser,authorizeRoles("admin"), deleteProduct);

router.route('/product/:id').get(getProductDetails);

router.route('/review').put(isAuthticatedUser, createProductReivew);

router.route('/reviews').get(getProductReviews).delete(isAuthticatedUser, deleteReivew);



module.exports = router; 