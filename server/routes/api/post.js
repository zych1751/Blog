const express = require('express');
const mongoose = require('mongoose');
const Posts = mongoose.model('Posts');

const router = express.Router();

/*
 * CREATE POST: POST /api/post
 * BODY SAMPLE: { title: "title", contents: "contents" }
 * ERROR CODES:
 *  1: EMPTY TITLE
 *  2: EMPTY CONTENTS
 */

router.post('/', (req, res) => {
    const title = req.body.title;
    const contents = req.body.contents;

    if(typeof title !== 'string' || title === "") {
        return res.status(400).json({
            error: "EMPTY TITLE",
            code: 1
        });
    } else if(typeof contents !== 'string' || contents === "") {
        return res.status(400).json({
            error: "EMPTY CONTENTS",
            code: 2
        });
    }

    let post = new Posts({
        title: title,
        writer: req.decoded.username,
        contents: req.body.contents
    });

    post.save( err => {
        if(err) throw err;
        return res.json(post);
    });
});

/*
 * GET POST: GET /api/post
 * ERROR CODES:
 *  1: INVALID ID
 *  2: NO RESOURCE
 */
router.get('/', (req, res) => {
    const id = req.query.id;

    if(!mongoose.Types.ObjectId.isValid(id)) {
        return res.json({
            error: "INVALID ID",
            code: 1
        });
    }

    Posts.findById(id, (err, post) => {
        if(err) throw err;

        if(!post) {
            res.json({
                error: "NO RESOURCE",
                code: 2
            });
        } else {
            res.json(post);
        }
    });
});

/*
 * GET POST LIST: GET /api/post/list
 */

router.get('/list', (req, res) => {
    Posts.find()
    .sort({ "_id": -1 })
    //.limit(6)
    .exec((err, posts) => {
        if(err) throw err;
        res.json(posts);
    });
});

/*
 * DELETE POST: DELETE /api/post/:id
 * ERROR CODES:
 *  1: INVALID ID
 *  2: NO RESOURCE
 */

router.delete('/:id', (req, res) => {
    const id = req.params.id

    if(!mongoose.Types.ObjectId.isValid(id)) {
        return res.json({
            error: "INVALID ID",
            code: 1
        });
    }

    Posts.findById(id, (err, post) => {
        if(err) throw err;

        if(!post) {
            return res.status(404).json({
                error: "NO RESOURCE",
                code: 2
            });
        }

        Posts.remove({_id: id}, err => {
            if(err) throw err;
            res.json(post);
        });
    });
});

/*
 * MODIFY POST: PUT /api/post/:id
 * BODY SAMPLE: { title: "title", contents: "contents" }
 * ERROR CODES:
 *  1. INVALID ID
 *  2. EMPTY TITLE
 *  3. EMPTY CONTENTS
 *  4. NO RESOURCE
 */

router.put('/:id', (req, res) => {
    const id = req.params.id

    if(!mongoose.Types.ObjectId.isValid(id)) {
        return res.json({
            error: "INVALID ID",
            code: 1
        });
    }

    const title = req.body.title;
    const contents = req.body.contents;

    if(typeof title !== 'string' || title === "") {
        return res.status(400).json({
            error: "EMPTY TITLE",
            code: 2
        });
    } else if(typeof contents !== 'string' || contents === "") {
        return res.status(400).json({
            error: "EMPTY CONTENTS",
            code: 3
        });
    }

    Posts.findById(id, (err, post) => {
        if(err) throw err;

        if(!post) {
            return res.status(404).json({
                error: "NO RESOURCE",
                code: 4
            });
        }

        post.title = req.body.title;
        post.contents = req.body.contents;
        post.date.edited = new Date();

        post.save((err, post) => {
            if(err) throw err;
            return res.json(post);
        });
    });
});

module.exports = router;
