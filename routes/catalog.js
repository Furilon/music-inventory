const express = require('express');
const router = express.Router();

const categoryController = require('../controllers/categoryController');
const itemController = require('../controllers/itemController');

// Catalog home page
router.get('/', categoryController.index)

// Categories List
router.get("/categories", categoryController.category_list)

// GET create category
router.get('/category/create', categoryController.category_create_get)

// POST create category
router.post('/category/create', categoryController.category_create_post)

// GET update category
router.get('/category/:id/update', categoryController.category_update_get)

// POST update category
router.post('/category/:id/update', categoryController.category_update_post)

// GET read category
router.get('/category/:id', categoryController.category_detail)

// GET delete category
router.get('/category/:id/delete', categoryController.category_delete_get)

// POST delete category
router.post('/category/:id/delete', categoryController.category_delete_post)

// GET read items
router.get('/items', itemController.item_list)

// GET create item
router.get('/item/create', itemController.item_create_get)

// POST create item
router.post('/item/create', itemController.item_create_post)

// GET read item
router.get('/item/:id', itemController.item_detail)

// GET update item
router.get('/item/:id/update', itemController.item_update_get)

// POST update item
router.post('/item/:id/update', itemController.item_update_post)

// GET delete item
router.get('/item/:id/delete', itemController.item_delete_get)

// POST delete item
router.post('/item/:id/delete', itemController.item_delete_post)


module.exports = router;
