const Category = require('../models/category');
const Item = require('../models/item');
const async = require('async');
const { body, validationResult } = require('express-validator');

exports.index = function (req, res) {
    async.parallel(
        {
            categories_count: function (callback) {
                Category.countDocuments({}, callback);
            },
            items_count: function (callback) {
                Item.countDocuments({}, callback);
            },
        },
        function (err, results) {
            res.render('index', {
                title: 'Music Inventory Home Page',
                error: err,
                data: results,
            });
        }
    );
};

exports.category_list = function (req, res, next) {
    async.parallel(
        {
            categories: function (callback) {
                Category.find().exec(callback);
            },
        },
        function (err, results) {
            if (err) {
                return next(err);
            }
            res.render('category_list', {
                title: 'List of categories',
                categories: results.categories,
            });
        }
    );
};

exports.category_detail = function (req, res, next) {
    async.parallel(
        {
            category: function (callback) {
                Category.findById(req.params.id).exec(callback);
            },
            items: function (callback) {
                Item.find({ category: req.params.id })
                    .populate('category')
                    .exec(callback);
            },
        },
        function (err, results) {
            if (err) {
                return next(err);
            }
            if (results.category == null) {
                let err = new Error('Category not found');
                err.status = 404;
                return next(err);
            }
            res.render('category_detail', {
                title: 'Category Detail',
                category: results.category,
                items: results.items,
            });
        }
    );
};

exports.category_create_get = function (req, res, next) {
    res.render('category_form', { title: 'Create category' });
};

exports.category_create_post = [
    body('name', 'Category name is required.')
        .trim()
        .isLength({ min: 1, max: 50 })
        .escape(),
    body('description', 'Description is required.')
        .trim()
        .isLength({ min: 1, max: 200 })
        .escape(),
    (req, res, next) => {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            res.render('category_form', {
                title: 'Create category',
                category: req.body,
                errors: errors.array(),
            });
            return;
        } else {
            let category = new Category({
                name: req.body.name,
                description: req.body.description,
            });
            category.save(function (err) {
                if (err) {
                    return next(err);
                }
                res.redirect(category.url);
            });
        }
    },
];

exports.category_update_get = function (req, res, next) {
    async.parallel(
        {
            category: function (callback) {
                Category.findById(req.params.id).exec(callback);
            },
        },
        function (err, results) {
            if (err) {
                return next(err);
            }
            if (results.category == null) {
                let err = new Error('Category not found.');
                err.status = 404;
                return next(err);
            }
            res.render('category_form', {
                title: 'Update Category',
                category: results.category,
            });
        }
    );
};

exports.category_update_post = [
    body('name', 'Name is required.')
        .trim()
        .isLength({ min: 1, max: 50 })
        .escape(),
    body('description', 'Description is required.')
        .trim()
        .isLength({ min: 1, max: 200 })
        .escape(),
    (req, res, next) => {
        const errors = validationResult(req);
        const category = new Category({
            name: req.body.name,
            description: req.body.description,
            _id: req.params.id,
        });

        if (!errors.isEmpty()) {
            async.parallel(
                {
                    category: function (callback) {
                        Category.findById(req.params.id).exec(callback);
                    },
                },
                function (err, results) {
                    if (err) {
                        return next(err);
                    }
                    res.render('category_form', {
                        title: 'Update Category',
                        errors: errors.array(),
                        category: results.category,
                    });
                }
            );
        } else {
            Category.findByIdAndUpdate(
                req.params.id,
                category,
                function (err, thecategory) {
                    if (err) {
                        return next(err);
                    }
                    res.redirect(thecategory.url);
                }
            );
        }
    },
];

exports.category_delete_get = function (req, res, next) {
    async.parallel(
        {
            category: function (callback) {
                Category.findById(req.params.id).exec(callback);
            },
            items: function (callback) {
                Item.find({ category: req.params.id })
                    .populate('category')
                    .exec(callback);
            },
        },
        function (err, results) {
            if (err) {
                return next(err);
            }
            if (results.category == null) {
                res.redirect('/catalog/categories');
            }
            res.render('category_delete', {
                title: 'Delete Category',
                category: results.category,
                items: results.items,
            });
        }
    );
};

exports.category_delete_post = function (req, res, next) {
    async.parallel(
        {
            category: function (callback) {
                Category.findById(req.body.categoryid).exec(callback);
            },
            items: function (callback) {
                Item.find({ category: req.body.categoryid })
                    .populate('category')
                    .exec(callback);
            },
        },
        function (err, results) {
            if (err) {
                return next(err);
            }
            if (results.items.length > 0) {
                res.render('category_delete', {
                    title: 'Delete Category',
                    category: results.category,
                    items: results.items,
                });
                return;
            } else {
                Category.findByIdAndRemove(
                    req.body.categoryid,
                    function deleteCategory(err) {
                        if (err) {
                            return next(err);
                        }
                        res.redirect('/catalog/categories');
                    }
                );
            }
        }
    );
};
