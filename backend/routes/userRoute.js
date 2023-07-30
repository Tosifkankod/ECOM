const express = require('express');
const { registerUser, loginUser, logout, forgotPassword, resetPassword, getUserDetails, updatepassword, updateProfile, getAllUsers, getSingleUser, updateUserRole, deleteUser } = require('../controllers/userController');
const {isAuthticatedUser, authorizeRoles} = require('../middleware/auth')
const router = express.Router();

router.route('/register').post(registerUser);

router.route('/login').post(loginUser);

router.route('/password/forgot').post(forgotPassword);

router.route('/password/reset/:token').put(resetPassword);

router.route('/logout').get(logout);

router.route('/me').get(isAuthticatedUser, getUserDetails);

router.route('/password/update').put(isAuthticatedUser, updatepassword);

router.route('/me/update').put(isAuthticatedUser, updateProfile);

router.route('/admin/users').get(isAuthticatedUser, authorizeRoles('admin'), getAllUsers);

router.route('/admin/user/:id').get(isAuthticatedUser, authorizeRoles('admin'), getSingleUser).put(isAuthticatedUser, authorizeRoles('admin'), updateUserRole).delete(isAuthticatedUser, authorizeRoles('admin'), deleteUser); 


module.exports = router; 