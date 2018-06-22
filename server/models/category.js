const mongoose = require('mongoose');

const Schema = mongoose.Schema;

const Category = new Schema({
    category: { type: String, required: true },
    subCategory: { type: String, require: true }
});

mongoose.model('Category', Category);
