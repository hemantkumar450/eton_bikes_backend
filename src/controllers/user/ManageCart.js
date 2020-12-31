import cartService from '../../services/user/cart-service.js';

class ManageCart {
    constructor() {
        return {
            getCartItemsByUser: this.getCartItemsByUser.bind(this),
            addCart: this.addCart.bind(this),
            updateCartStatus: this.updateCartStatus.bind(this),
            removeCartOneItem: this.removeCartOneItem.bind(this),
            removeCartItem: this.removeCartItem.bind(this),
        }
    }

    async getCartItemsByUser(req, res, next) {
        try {
            const { id } = req.user;
            const cartList = await cartService.getCartItemsByUser({ userId: id });
            return res.status(200).json({
                success: true,
                message: "Cart List by User",
                data: cartList
            })
        } catch (error) {
            next(error)
        }
    }

    async removeCartItem(req, res, next) {
        try {
            const { id } = req.user;
            const object = Object.assign({ userId: id }, req.body);
            let cart = await cartService.deleteCartItem(object);
            return res.status(200).json({
                success: true,
                message: "Cart Item deleted",
                data: cart
            });
        } catch (e) {
            next(e)
        }
    }
    async removeCartOneItem(req, res, next) {
        try {
            const { id } = req.user;
            const object = Object.assign({ userId: id }, req.body);
            let cart = await cartService.deleteCartOneItem(object);
            return res.status(200).json({
                success: true,
                message: "Cart Item deleted",
                data: cart
            });
        } catch (e) {
            next(e)
        }
    }
    async addCart(req, res, next) {
        try {
            const { id } = req.user;
            const object = Object.assign({ userId: id }, req.body);
            let cart = await cartService.addCart(object);
            return res.status(200).json({
                success: true,
                message: "Cart Item Added",
                data: cart
            });
        } catch (e) {
            next(e)
        }
    }

    async updateCartStatus(req, res, next) {
        try {
            const object = Object.assign(req.params, req.body);
            let cart = await cartService.updateCartStatus(object);
            return res.status(200).json({
                success: true,
                message: "Cart status updated",
                data: cart
            });
        } catch (e) {
            next(e)
        }
    }
}

export default new ManageCart();