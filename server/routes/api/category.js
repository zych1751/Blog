const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');
const Category = mongoose.model('Category');

/*
 * ADD CATEGORY: POST /api/category/
 * BODY SAMPLE: { "category": "animal", "subCategory": "cat" }
 * ERROR CODES:
 *  1: EMPTY CATEGORY
 *  2: EMPTY SUBCATEGORY
 *  3: CATEGORY EXIST
 */

router.post('/', (req, res) => {
    const categoryName = req.body.category;
    const subCategory = req.body.subCategory;

    if(typeof categoryName !== "string" || categoryName.length == 0) {
        return res.status(400).json({
            error: "EMPTY CATEGORY",
            code: 1
        });
    }
    if(typeof subCategory !== "string" || subCategory.length == 0) {
        return res.status(400).json({
            error: "EMPTY SUBCATEGORY",
            code: 2
        });
    }

    Category.findOne({ category: categoryName, subCategory: subCategory }, (err, exist) => {
        if(err) throw err;

        if(exist) {
            return res.status(409).json({
                error: "CATEGORY EXIST",
                code: 3
            });
        }

        const category = new Category({
            category: categoryName,
            subCategory: subCategory
        });

        category.save((err) => {
            if(err) throw err;
            res.json(category);
        });
    })
});

module.exports = router;
