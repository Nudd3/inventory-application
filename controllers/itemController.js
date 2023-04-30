const Item = require('../models/item');
const Category = require('../models/category');

const asyncHandler = require('express-async-handler');
// const { body, validationResult } = require('express-validator');

exports.index = asyncHandler(async (req, res, next) => {
  const [
    numCategories,
    numItems,
  ] = await Promise.all([
    Category.countDocuments({}).exec(),
    Item.countDocuments({}).exec(),
  ]);

  res.render('index', {
    title: 'Inventory Application Home',
    category_count: numCategories,
    item_count: numItems,
  });
});

// Display list of all items
exports.item_list = asyncHandler(async (req, res, next) => {
  const allItems = await Item.find({}, 'name price')
    .sort({ name: 1 })
    .populate('price')
    .exec();

  res.render('item_list', { 
    title: 'Item List', 
    item_list: allItems 
  });
});

// Display detail page for a specific item
exports.item_detail = asyncHandler(async (req, res, next) => {
  const item = await Item.findById(req.params.id)
    .populate('category')
    .exec();

  if (item === null) {
    // No result
    const err = new Error('Item not found');
    err.status = 404;
    return next(err);
  }

  res.render('item_detail', {
    title: 'Item:',
    item: item,
  });
});

// Display item create form on GET
exports.item_create_get = asyncHandler(async (req, res, next) => {
  res.send('NOT IMPLEMENTED: Item create GET');
});

// Display item create form on POST
exports.item_create_post = asyncHandler(async (req, res, next) => {
  res.send('NOT IMPLEMENTED: Item create POST');
});

// Display item delete form on GET
exports.item_delete_get = asyncHandler(async (req, res, next) => {
  res.send('NOT IMPLEMENTED: Item delete GET');
});

// Display item delete form on POST
exports.item_delete_post = asyncHandler(async (req, res, next) => {
  res.send('NOT IMPLEMENTED: Item delete POST');
});

// Display item update form on GET
exports.item_update_get = asyncHandler(async (req, res, next) => {
  res.send('NOT IMPLEMENTED: Item update GET');
});

// Display item update form on POST
exports.item_update_post = asyncHandler(async (req, res, next) => {
  res.send('NOT IMPLEMENTED: Item update POST');
});