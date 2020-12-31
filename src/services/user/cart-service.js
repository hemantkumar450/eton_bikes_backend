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
            updateCartStatus: this.updateCartStatus.bind(this),
            deleteCartOneItem: this.deleteCartOneItem.bind(this),
            deleteCartItem: this.deleteCartItem.bind(this),
            deleteUserCartItems: this.deleteUserCartItems.bind(this),
        }
    }

    async getCartItemsByUser({ userId }) {
        try {
            const cartItems = await Cart.find({ user: userId, status: 'bucket' })
                .populate({
                    path: 'sub_product',
                    populate: { path: 'product' }
                })
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

    async deleteCartOneItem({ userId, sub_product }) {
        try {
            const deleted = await Cart.findOneAndDelete({ user: userId, sub_product });
            return deleted;
        } catch (e) {
            throw (e);
        }
    }

    async deleteCartItem({ userId, sub_product }) {
        try {
            const deleted = await Cart.deleteMany({ user: userId, sub_product });
            return deleted;
        } catch (e) {
            throw (e);
        }
    }

    async deleteUserCartItems({ userId }) {
        try {
            const deleted = await Cart.deleteMany({ user: userId });
            return deleted;
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