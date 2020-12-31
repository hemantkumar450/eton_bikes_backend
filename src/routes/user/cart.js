
import express from 'express';
const router = express.Router();
import CartController from '../../controllers/user/ManageCart';
const CheckToken = require('../../middlewares/checkToken');

// create login routes
router.get('/cart', CheckToken.jwtVerifyForUser, CartController.getCartItemsByUser)
    .post('/cart', CheckToken.jwtVerifyForUser, CartController.addCart)
    .put('/cart/:cartId', CheckToken.jwtVerifyForUser, CartController.updateCartStatus)

router.post('/cart/remove/one', CheckToken.jwtVerifyForUser, CartController.removeCartOneItem);
router.post('/cart/remove', CheckToken.jwtVerifyForUser, CartController.removeCartItem);
module.exports = router;