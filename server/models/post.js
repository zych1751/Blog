const mongoose = require('mongoose');

const Schema = mongoose.Schema;

const Post = new Schema({
    title: String,
    writer: String,
    contents: String,
    date: {
        created: { type: Date, default: Date.now },
        edited: { type: Date, default: Date.now }
    }
    /*
     * TODO: tags, comments
     */
});

mongoose.model('Posts', Post);
