const express = require('express');
const mongoose = require('mongoose');
const Post = mongoose.model('Post');
const Category = mongoose.model('Category');
const adminAuthMiddleware = require('../../middlewares/adminAuth');

const router = express.Router();

/*
 * CREATE POST: POST /api/post
 * BODY SAMPLE: { title: "title", contents: "contents", category: "animal", subCategory: "cat" }
 * ERROR CODES:
 *  1: EMPTY TITLE
 *  2: EMPTY CONTENTS
 *  3: CATEGORY DO NOT EXIST
 */

router.post('/', adminAuthMiddleware);
router.post('/', (req, res) => {
    const title = req.body.title;
    const contents = req.body.contents;
    const categoryName = req.body.category;
    const subCategory = req.body.subCategory;

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

    if(typeof categoryName !== 'string' || categoryName === "" || typeof subCategory !== "string" || subCategory === "") {
        return res.status(400).json({
            error: "CATEGORY DO NOT EXIST",
            code: 3
        });
    }

    Category.findOne({ category: categoryName, subCategory: subCategory }, (err, category) => {
        if(!category) {
            return res.status(400).json({
                error: "CATEGORY DO NOT EXIST",
                code: 3
            });
        }

        const post = new Post({
            title: title,
            contents: req.body.contents,
            category: category._id
        });

        post.save( (err) => {
            if(err) throw err;
            return res.json(post);
        });
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

    Post.findById(id, (err, post) => {
        if(err) throw err;

        if(!post) {
            res.json({
                error: "NO RESOURCE",
                code: 2
            });
        } else {
            Category.findById(post.category, (err, category) => {
                if(err) throw err;

                post.category = category;
                res.json(post);
            });
        }
    });
});

/*
 * GET POST LIST: GET /api/post/list
 * PARAMS: { "categoryId": "id", "page": 3 }
 */

router.get('/list', (req, res) => {
    const categoryId = req.query.categoryId;
    var page = Number(req.query.page);
    const postNumInPage = 5;

    if(typeof categoryId === "undefined") {
        if(!Number.isInteger(page)) {
            page = 1;
        }

        Post.count()
        .exec((err, count) => {
            const endPage = (((count - 1) / postNumInPage) >> 0) + 1;

            Post.find()
            .sort({ "_id": -1 })
            .skip((page-1) * postNumInPage)
            .limit(postNumInPage)
            .exec((err, posts) => {
                if(err) throw err;
                res.json({
                    posts: posts,
                    currentPage: page,
                    endPage: endPage,
                    postNumInPage: postNumInPage
                });
            });
        });
    } else {
        if(!Number.isInteger(page)) {
            page = 1;
        }

        Post.find({ "category": categoryId })
        .count()
        .exec((err, count) => {
            const endPage = (((count - 1) / postNumInPage) >> 0) + 1;

            Post.find({ "category": categoryId })
            .sort({ "_id": -1 })
            .skip((page-1) * postNumInPage)
            .limit(postNumInPage)
            .exec((err, posts) => {
                if(err) throw err;
                res.json({
                    posts: posts,
                    currentPage: page,
                    endPage: endPage,
                    postNumInPage: postNumInPage
                });
            });
        });
    }
});

/*
 * DELETE POST: DELETE /api/post/:id
 * ERROR CODES:
 *  1: INVALID ID
 *  2: NO RESOURCE
 */

router.delete('/:id', adminAuthMiddleware);
router.delete('/:id', (req, res) => {
    const id = req.params.id;

    if(!mongoose.Types.ObjectId.isValid(id)) {
        return res.json({
            error: "INVALID ID",
            code: 1
        });
    }

    Post.findById(id, (err, post) => {
        if(err) throw err;

        if(!post) {
            return res.status(404).json({
                error: "NO RESOURCE",
                code: 2
            });
        }

        Post.remove({_id: id}, err => {
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

router.put('/:id', adminAuthMiddleware);
router.put('/:id', (req, res) => {
    const id = req.params.id;

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

    Post.findById(id, (err, post) => {
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
