const Item = require('../models/item');
const async = require('async');
const Category = require('../models/category');
const { body, validationResult } = require('express-validator');

exports.item_list = function (req, res, next) {
    async.parallel(
        {
            items: function (callback) {
                Item.find().populate('category').exec(callback);
            },
        },
        function (err, results) {
            if (err) {
                return next(err);
            }
            res.render('item_list', {
                title: 'List of items',
                items: results.items,
            });
        }
    );
};

exports.item_detail = function (req, res, next) {
    async.parallel(
        {
            item: function (callback) {
                Item.findById(req.params.id)
                    .populate('category')
                    .exec(callback);
            },
        },
        function (err, results) {
            if (err) {
                return next(err);
            }
            if (results.item == null) {
                let err = new Error("Can't find this item.");
                err.status = 404;
                return next(err);
            }
            res.render('item_detail', {
                title: 'Item Detail',
                item: results.item,
            });
        }
    );
};

exports.item_create_get = function (req, res, next) {
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
            res.render('item_form', {
                title: 'Create Item',
                categories: results.categories,
            });
        }
    );
};

exports.item_create_post = [
    body('name', 'Name is required')
        .trim()
        .isLength({ min: 1, max: 50 })
        .escape(),
    body('description', 'Description is required')
        .trim()
        .isLength({ min: 1, max: 200 })
        .escape(),
    body('category', 'Category is required')
        .trim()
        .isLength({ min: 1, max: 50 })
        .escape(),
    body('number_in_stock', 'Quantity is required')
        .trim()
        .isAlphanumeric()
        .escape(),
    body('price', 'Price is required').trim().escape(),

    (req, res, next) => {
        const errors = validationResult(req);
        const item = new Item({
            name: req.body.name,
            description: req.body.description,
            category: req.body.category,
            number_in_stock: req.body.number_in_stock,
            price: req.body.price,
        });

        if (!errors.isEmpty()) {
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
                    res.render('item_form', {
                        title: 'Create Item',
                        categories: results.categories,
                        item: item,
                        errors: errors.array(),
                    });
                    return;
                }
            );
        } else {
            item.save(function (err) {
                if (err) {
                    return next(err);
                }
                res.redirect(item.url);
            });
        }
    },
];

exports.item_update_get = function (req, res, next) {
    async.parallel(
        {
            item: function (callback) {
                Item.findById(req.params.id)
                    .populate('category')
                    .exec(callback);
            },
            categories: function (callback) {
                Category.find().exec(callback);
            },
        },
        function (err, results) {
            if (err) {
                return next;
            }
            if (results.item === null) {
                const err = new Error("Couldn't find this item");
                err.status = 404;
                return next(err);
            }
            res.render('item_form', {
                title: 'Update item',
                item: results.item,
                categories: results.categories,
            });
        }
    );
};

exports.item_update_post = [
    body('name', 'Name is required')
        .trim()
        .isLength({ min: 1, max: 50 })
        .escape(),
    body('description', 'Description is required')
        .trim()
        .isLength({ min: 1, max: 200 })
        .escape(),
    body('category', 'Category is required')
        .trim()
        .isLength({ min: 1, max: 50 })
        .escape(),
    body('number_in_stock', 'Quantity is required')
        .trim()
        .isAlphanumeric()
        .escape(),
    body('price', 'Price is required').trim().escape(),
    (req, res, next) => {
        const errors = validationResult(req);
        const item = new Item({
            name: req.body.name,
            description: req.body.description,
            category: req.body.category,
            number_in_stock: req.body.number_in_stock,
            price: req.body.price,
            _id: req.params.id,
        });

        if (!errors.isEmpty()) {
            async.parallel(
                {
                    item: function (callback) {
                        Item.findById(req.params.id)
                            .populate('category')
                            .exec(callback);
                    },
                    categories: function (callback) {
                        Category.find().exec(callback);
                    },
                },
                function (err, results) {
                    if (err) {
                        return next;
                    }
                    res.render('item_form', {
                        title: 'Update item',
                        item: results.item,
                        categories: results.categories,
                        errors: errors.array(),
                    });
                }
            );
        } else {
            Item.findByIdAndUpdate(
                req.params.id,
                item,
                function (err, theitem) {
                    if (err) {
                        return next(err);
                    }
                    res.redirect(theitem.url);
                }
            );
        }
    },
];

exports.item_delete_get = function (req, res, next) {
    async.parallel(
        {
            item: function (callback) {
                Item.findById(req.params.id)
                    .populate('category')
                    .exec(callback);
            },
        },
        function (err, results) {
            if (err) {
                return next(err);
            }
            if (results.item == null) {
                res.redirect('/catalog/items');
            }
            res.render('item_delete', {
                title: 'Delete item',
                item: results.item,
            });
        }
    );
};

exports.item_delete_post = function (req, res, next) {
    async.parallel(
        {
            item: function (callback) {
                Item.findById(req.body.itemid);
            },
        },
        function (err, results) {
            if (err) {
                return next(err);
            }
            Item.findByIdAndRemove(req.body.itemid, function deleteItem(err) {
                if (err) {
                    return next(err);
                }
                res.redirect('/catalog/items');
            });
        }
    );
};
