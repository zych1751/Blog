import { connection, connect } from 'mongoose';
import { model } from 'mongoose';
// Add Model
import '../models/post';
import '../models/account';
import '../models/category';
import mariaDB from '../models/mariadbIndex';

const mongo = connection;
mongo.on('error', console.error);
mongo.once('open', () => {
    console.log('Connected to mongodb server');
});
connect('mongodb://localhost/blog', {
    useNewUrlParser: true,
    useUnifiedTopology: true,
});

function migrateAccount() {
    const Account = model('Account');
    const mariadbAccount = mariaDB.Account;

    Account.find({}, (err, accounts) => {
        if(err) {
            console.log(err);
            return;
        }

        accounts.forEach(account => {
            const admin = account.admin;
            const username = account.username;
            const password = account.password; // hashed
            const created = account.created;

            try {
                mariadbAccount.create({
                    username: username,
                    password: password,
                    admin: admin,
                    createdAt: created
                });
                console.log("account migration ok");
            } catch (err) {
                console.log("account migration fail");
                console.log(account);
                console.log(err.errors);
            }
        });
    });
}

async function migrateCategory() {
    const Category = model('Category');
    const mariadbCategory = mariaDB.Category;

    const categories = await Category.find({}).exec();

    // this function have to be executed sequentially
    // category name in mongodb is unique
    for(const category of categories) {
        const parentCategoryName = category.category;
        const subCategoryName = category.subCategory;

        let parentCategory = await mariadbCategory.findOne({
            where: {
                name: parentCategoryName
            }
        });

        if(parentCategory === null) {
            try {
                parentCategory = await mariadbCategory.create({
                    name: parentCategoryName
                });
            } catch (err) {
                console.log("cannot create category");
                console.log(category);
                console.log(err);
                return;
            }
        }

        try {
            const subCategory = await mariadbCategory.create({
                name: subCategoryName
            });
            subCategory.setParent(parentCategory);
        } catch (err) {
            console.log("cannot create subCategory");
            console.log(category);
            console.log(err);
        }
    }
}

function migratePost() {
    const Category = model('Category');
    const mariadbCategory = mariaDB.Category;
    mariadbCategory.sync();
    const Post = model('Post');
    const mariadbPost = mariaDB.Post;
    mariadbPost.sync();

    Post.find({}, async (err, posts) => {
        if(err) {
            console.log(err);
            return;
        }

        for(const post of posts) {
            const title = post.title;
            const contents = post.contents;
            const createdAt = post.date.created;
            const updatedAt = post.date.edited;
            const categoryID = post.category;

            try {
                const mongoCategory = await Category.findOne({
                    "_id": categoryID
                }).exec();

                const mariaDBMainCategory = await mariadbCategory.findOne({
                    where: {
                        name: mongoCategory.category
                    }
                });
                const mariaDBSubCategory = await mariadbCategory.findOne({
                    where: {
                        name: mongoCategory.subCategory
                    }
                });

                const post = await mariadbPost.create({
                    title: title,
                    contents: contents,
                    createdAt: createdAt,
                    updatedAt: updatedAt
                });
                post.setMainCategory(mariaDBMainCategory);
                post.setSubCategory(mariaDBSubCategory);
            } catch (err) {
                console.log("cannot create post");
                console.log(post);
                console.log(err);
            }
        }
    });
}

async function migrate() {
    migrateAccount();
    await migrateCategory();
    migratePost();
}

migrate();
