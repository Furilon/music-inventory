const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const CategorySchema = new Schema({
    name: {
        type: String,
        required: true,
        maxlength: 100,
    },
    description: {
        type: String,
        required: true,
        maxlength: 200,
    },
})

CategorySchema.virtual("url").get(function () {
    return '/catalog/category/' + this._id
})

module.exports = mongoose.model('Category', CategorySchema)