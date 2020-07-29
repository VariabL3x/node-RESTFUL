const router = require('express').Router()
const AuthController = require('../controllers/AuthController');
const UserController = require('../controllers/UserController');

//register user
router.post('/register',UserController.register);

//login user return jwt token
router.post('/login',UserController.login);

/**
 * get all user
 * require jwt token
 * admin only
 */
router.get('/all',[AuthController.verifyToken,AuthController.adminOnly,UserController.get_all]);

/**
 * get user info
 * require jwt token
 * same user or admin can do this
 */
router.get('/user/:id',[AuthController.verifyToken,AuthController.sameUserOrAdmin,UserController.get_by_id]);

/**
 * update user's firstname and lastname
 * require jwt token
 * same user can do this only
 */
router.put('/user/:id',[AuthController.verifyToken,AuthController.sameUser,UserController.put_by_id]);

/**
 * update user's password
 * require jwt token
 * same user can do this 
 */
router.put('/user/:id/password',[AuthController.verifyToken,AuthController.sameUser,UserController.update_password]);

module.exports = router;