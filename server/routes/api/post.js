import { Router } from 'express';
import adminAuthMiddleware from '../../middlewares/adminAuth';
import mariaDB from '../../models';
import { isNormalInteger } from '../../utils/parser';

const router = Router();
const Category = mariaDB.Category;
const Post = mariaDB.Post;

/*
 * CREATE POST: POST /api/post
 * BODY SAMPLE: { title: "title", contents: "contents", categoryId: 7 }
 * ERROR CODES:
 *  1: EMPTY TITLE
 *  2: EMPTY CONTENTS
 *  3: CATEGORY DO NOT EXIST
 *  4: INTERNAL SERVER ERROR
 */

router.post('/', adminAuthMiddleware);
router.post('/', async (req, res) => {
    const title = req.body.title;
    const contents = req.body.contents;
    const categoryId = req.body.categoryId;

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

    if(!Number.isInteger(categoryId)) {
        return res.status(400).json({
            error: "CATEGORY DO NOT EXIST",
            code: 3
        });
    }

    try {
        const category = await Category.findOne({
            where: {
                id: categoryId
            }
        });

        if(category === null) {
            return res.status(400).json({
                error: "CATEGORY DO NOT EXIST",
                code: 3
            });
        }

        const parentCategory = await category.getParent();

        // 상위 카테고리에는 추가할 수 없게 함
        if(parentCategory === null) {
            return res.status(400).json({
                error: "CATEGORY DO NOT EXIST",
                code: 3
            });
        }

        const post = await Post.create({
            title: title,
            contents: contents
        });
        post.setMainCategory(parentCategory);
        post.setSubCategory(category);

        res.json({
            post: post
        });
    } catch(err) {
        res.status(500).json({
            error: err,
            code: 4
        });
    }
});

/*
 * GET POST: GET /api/post
 * ERROR CODES:
 *  1: INVALID ID
 *  2: NO RESOURCE
 *  3: INTERNAL SERVER ERROR
 */
router.get('/', async (req, res) => {
    if(req.query.id === undefined || !isNormalInteger(req.query.id)) {
        return res.json({
            error: "INVALID ID",
            code: 1
        });
    }

    const id = Number.parseInt(req.query.id);

    try {
        const post = await Post.findOne({
            where: {
                id: id
            }
        });

        if(post === null) {
            res.json({
                error: "NO RESOURCE",
                code: 2
            });
            return;
        }

        const mainCategory = await post.getMainCategory();
        const subCategory = await post.getSubCategory();

        res.json({
            post: post,
            category: {
                mainCategory: mainCategory,
                subCategory: subCategory
            }
        });
    } catch(err) {
        res.status(500).json({
            error: err,
            code: 3
        });
    }
});

/*
 * GET POST LIST: GET /api/post/list
 * PARAMS: { "categoryId": 7, "page": 3 }
 * ERROR CODES:
 *  1: INVALID CATEGORY ID
 *  2: INTERNAL SERVER ERROR
 */

const postNumInPage = 6;
router.get('/list', async (req, res) => {
    let categoryId = req.query.categoryId;
    let page = req.query.page;
    if(!isNormalInteger(page)) {
        page = 1;
    } else {
        page = Number(page);
    }

    const Op = mariaDB.Sequelize.Op;
    let whereOption = {};
    if(typeof categoryId === "undefined") {
    } else if(!isNormalInteger(categoryId)) {
        res.status(400).json({
            error: "INVALID CATEGORY ID",
            code: 1
        });
        return;
    } else {
        categoryId = Number(categoryId);
        whereOption = {
            [Op.or]: [{
                main_category_id: categoryId
            }, {
                sub_category_id: categoryId
            }]
        }
    }

    const posts = await Post.findAndCountAll({
        where: whereOption,
        order: [
            ['createdAt', 'DESC']
        ],
        include: [{
            model: Category,
            as: "mainCategory",
        }, {
            model: Category,
            as: "subCategory",
        }],
        limit: postNumInPage,
        offset: (page-1)*postNumInPage
    });
    console.log(posts);

    const endPage = (((posts.count - 1) / postNumInPage) >> 0) + 1;
    res.json({
        posts: posts.rows,
        currentPage: page,
        endPage: endPage,
        postNumInPage: postNumInPage
    });
});

/*
 * DELETE POST: DELETE /api/post/:id
 * ERROR CODES:
 *  1: INVALID ID
 *  2: NO RESOURCE
 */

router.delete('/:id', adminAuthMiddleware);
router.delete('/:id', async (req, res) => {
    if(req.params.id === undefined || !isNormalInteger(req.params.id)) {
        return res.json({
            error: "INVALID ID",
            code: 1
        });
    }

    const id = Number.parseInt(req.params.id);

    const post = await Post.findOne({
        where: {
            id: id
        }
    });

    if(post === null) {
        res.json({
            error: "NO RESOURCE",
            code: 2
        });
        return;
    }

    await post.destroy();
    return res.json(post);
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
router.put('/:id', async (req, res) => {
    if(req.params.id === undefined || !isNormalInteger(req.params.id)) {
        return res.json({
            error: "INVALID ID",
            code: 1
        });
    }

    const id = Number.parseInt(req.params.id);

    const post = await Post.findOne({
        where: {
            id: id
        }
    });

    if(post === null) {
        res.status(404).json({
            error: "NO RESOURCE",
            code: 4
        });
        return;
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

    post.title = req.body.title;
    post.contents = req.body.contents;
    await post.save();
    res.json(post);
});

export default router;
