import { Cart } from '../../models';
import crypto from 'crypto';

class CartServices {
    constructor() {
        this.updateOptions = {
            upsert: true,
            new: true,
            setDefaultsOnInsert: true
        };
        return {
            getCartItemsByUser: this.getCartItemsByUser.bind(this),
            addCart: this.addCart.bind(this),
            updateCartStatus: this.updateCartStatus.bind(this)
        }
    }

    async getCartItemsByUser({ userId }) {
        try {
            const cartItems = await Cart.find({ user: userId, status: 'bucket' })
                .populate('sub_product')
                .populate('sub_product.product');
            return cartItems;
        } catch (e) {
            throw (e)
        }
    }

    async addCart({ userId, sub_product }) {
        try {
            const cart = await Cart.create({ user: userId, sub_product });
            return cart;
        } catch (e) {
            throw (e);
        }
    }

    async updateCartStatus({ cartId, status }) {
        try {
            const cart = await Cart.updateOne({ _id: cartId }, { status }, { new: true });
            return cart;
        } catch (e) {
            throw (e);
        }
    }
}

export default new CartServices();