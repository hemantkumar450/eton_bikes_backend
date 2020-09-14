import { Category } from '../../models';

class CategoriesService {
    constructor() {
        return {
            saveCategories: this.saveCategories.bind(this),
            fetchCategories: this.fetchCategories.bind(this),
        }
    }
    async fetchCategories() {
        return await Category.find({}).populate('child_categories parent_category', 'name');
        
    }
    async saveCategories({ name, description, parent, active }) {
        try {            
            const cat = await Category.create({
                name,
                description,
                active,
                parent_category: parent
            });
            if (parent) {
                await Category.updateOne({ _id: parent }, { $push: { child_categories: cat._id } });
            }
            return cat;
        } catch (error) {
            throw (error);
        }
    }
}
export default new CategoriesService();