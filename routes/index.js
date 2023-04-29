var express = require('express');
var router = express.Router();

// Require controller modules
const category_controller = require('../controllers/categoryController');
const item_controller = require('../controllers/itemController');

/* GET home page. */
router.get('/', item_controller.index);

/*** ITEM ROUTES ***/

// GET request for creating an Item. NOTE: this must
// come before routes that display Item (uses id)
router.get('/item/create', item_controller.item_create_get);

// POST request for creating an Item
router.post('/item/create', item_controller.item_create_post);

// GET request to delete an Item
router.get('/item/:id/delete', item_controller.item_delete_get);

// POST request to delete an Item
router.post('/item/:id/delete', item_controller.item_delete_post);

// GET request to update an Item
router.get('/item/:id/update', item_controller.item_update_get);

// POST request to update an Item
router.post('/item/:id/update', item_controller.item_update_post);

// GET request for one Item
router.get('/item/:id', item_controller.item_detail);

// GET request for list of all Items
router.get('/items', item_controller.item_list);


/*** Category ROUTES ***/

// GET request for creating a Category. NOTE: this must
// come before routes that display Category (uses id)
router.get('/category/create', category_controller.category_create_get);

// POST request for creating an category
router.post('/category/create', category_controller.category_create_post);

// GET request to delete an category
router.get('/category/:id/delete', category_controller.category_delete_get);

// POST request to delete an category
router.post('/category/:id/delete', category_controller.category_delete_post);

// GET request to update an category
router.get('/category/:id/update', category_controller.category_update_get);

// POST request to update an category
router.post('/category/:id/update', category_controller.category_update_post);

// GET request for one category
router.get('/category/:id', category_controller.category_detail);

// GET request for list of all category
router.get('/categories', category_controller.category_list);



module.exports = router;
