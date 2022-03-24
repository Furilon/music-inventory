const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const ItemSchema = new Schema({
    name: {
        type: String,
        required: true,
        maxLength: 50,
    },
    description: {
        type: String,
        required: true,
        maxLength: 200,
    },
    category: {
        type: Schema.Types.ObjectId,
        ref: "Category",
        required: true,
    },
    price: {
        type: Number,
        required: true,
    },
    number_in_stock: {
        type: Number,
        required: true,
    }
});

ItemSchema.virtual('url').get(function () {
    return "/catalog/item/" + this._id
})

module.exports = mongoose.model("Item", ItemSchema)