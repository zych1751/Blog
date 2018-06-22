const mongoose = require('mongoose');

const Schema = mongoose.Schema;

const Post = new Schema({
    title: { type: String, required: true },
    contents: { type: String, required: true },
    date: {
        created: { type: Date, default: Date.now },
        edited: { type: Date, default: Date.now }
    },
    category: { type: Schema.Types.ObjectId, ref: 'Category', required: true }
});

mongoose.model('Post', Post);
