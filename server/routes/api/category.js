import { Router } from 'express';
import adminAuthMiddleware from '../../middlewares/adminAuth';
import mariaDB from '../../models';
import { QueryTypes } from 'sequelize';

const router = Router();
const Category = mariaDB.Category;

/*
 * ADD CATEGORY: POST /api/category/
 * BODY SAMPLE: { "category": "animal", "subCategory": "cat" }
 * ERROR CODES:
 *  1: EMPTY CATEGORY
 *  2: EMPTY SUBCATEGORY
 *  3: CATEGORY EXIST
 *  4: CANNOT CREATE CATEGORY (500)
 */

router.post('/', adminAuthMiddleware);
router.post('/', async (req, res) => {
    const categoryName = req.body.category;
    const subCategoryName = req.body.subCategory;

    if(typeof categoryName !== "string" || categoryName.length == 0) {
        return res.status(400).json({
            error: "EMPTY CATEGORY",
            code: 1
        });
    }
    if(typeof subCategoryName !== "string" || subCategoryName.length == 0) {
        return res.status(400).json({
            error: "EMPTY SUBCATEGORY",
            code: 2
        });
    }

    let category = await Category.findOne({
        where: {
            name: categoryName
        }
    });

    let subCategory = await Category.findOne({
        where: {
            name: subCategoryName
        }
    });

    if(subCategory !== null) {
        return res.status(409).json({
            error: "CATEGORY EXIST",
            code: 3
        });
    }

    if(category === null) {
        try {
            category = await Category.create({
                name: categoryName
            });
        } catch(err) {
            return res.status(500).json({
                error: "CANNOT CREATE CATEGORY",
                code: 4
            });
        }
    }

    try {
        subCategory = await Category.create({
            name: subCategoryName
        });
        subCategory.setParent(category);
    } catch(err) {
        // TODO: transcation
        return res.status(500).json({
            error: "CANNOT CREATE CATEGORY"
        });
    }
    return res.json({
        category: category,
        subCategory: subCategory
    });
});

/*
 * GET CATEGORY BY ID: GET /api/category?id=abcd
 * ERROR CODES:
 *  1: CATEGORY DO NOT EXIST
 */

router.get('/', async (req, res) => {
    const id = req.query.id;

    if(typeof id !== "string") {
        return res.status(400).json({
            error: "CATEGORY DO NOT EXIST",
            code: 1
        });
    }

    let category = await Category.findOne({
        where: {
            id: id
        }
    });

    if(category === null) {
        return res.status(400).json({
            error: "CATEGORY DO NOT EXIST",
            code: 1
        });
    }

    const parentCategory = await category.getParent();

    if(parentCategory == null) {
        return res.json({
            category: category
        });
    } else {
        return res.json({
            category: parentCategory,
            subCategory: category
        });
    }
});

/*
 * GET CATEGORY LIST: GET /api/category/list
 */

router.get('/list', async (_, res) => {
    const categories = await mariaDB.sequelize.query("SELECT * FROM categories WHERE parent_id IS NULL", { 
        type: QueryTypes.SELECT, 
        model: mariaDB.Category
    });
    const result = {categoryList: []};

    for(const category of categories) {
        result.categoryList.push({
            category: category,
            subCategoryList: await category.getChildren()
        });
    }

    res.json(result);
});

export default router;
