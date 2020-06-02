import { Schema as _Schema, model } from 'mongoose';

const Schema = _Schema;

const Category = new Schema({
    category: { type: String, required: true },
    subCategory: { type: String, require: true }
});

model('Category', Category);
