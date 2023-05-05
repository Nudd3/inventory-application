const Item = require('../models/item');
const Category = require('../models/category');

const asyncHandler = require('express-async-handler');
const { body, validationResult } = require('express-validator');

exports.index = asyncHandler(async (req, res, next) => {
  const [
    numCategories,
    numItems,
  ] = await Promise.all([
    Category.countDocuments({}).exec(),
    Item.countDocuments({}).exec(),
  ]);

  res.render('index', {
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

  const allCategories = await Category.find().exec();

  res.render('item_form', {
    title: 'Create Item',
    categories: allCategories,
  });
});

// Display item create form on POST
exports.item_create_post = [
  // Validate and sanitize fields:
  // name, description, category, price, numberInStock
  body('name', 'Name field must not be empty')
    .trim()
    .isLength({ min: 1 })
    .withMessage('Name needs to be at least 1 characters long')
    .isLength({ max: 100 })
    .withMessage('Name length cannot exceed 100 characters')
    .escape(),
  body('description', 'description field must not be empty')
    .trim()
    .isLength({ min: 10 })
    .withMessage('Description needs to be at least 10 characters long')
    .isLength({ max: 100})
    .withMessage('Description length cannot exceed 100 characters')
    .escape(),

  asyncHandler(async (req, res, next) => {
    const errors = validationResult(req);

    const item = new Item({
      name: req.body.name,
      description: req.body.description,
      category: req.body.category,
      price: req.body.price,
      nrInStock: req.body.nrInStock,
    });

    if (!errors.isEmpty()) {
      // There are errors
      // Render form again with sanitized values/errors messages

      const allCategories = await Category.find().exec();

      res.render('item_form', {
        title: 'Create Item',
        categories: allCategories,
        item: item,
        errors: errors.array(),
      }); 
    } else {
      // Form inputs are valid. Save item
      await item.save();
      res.redirect(item.url);
    }
  })
];

// Display item delete form on GET
exports.item_delete_get = asyncHandler(async (req, res, next) => {
  const item = await Item.findById(req.params.id).exec();

  if (item === null) {
    // Doesn't exist
    res.redirect('/items');
  }

  res.render('item_delete', {
    title: 'Delete Item',
    item: item,
  });
});

// Display item delete form on POST
exports.item_delete_post = asyncHandler(async (req, res, next) => {
  await Item.findByIdAndRemove(req.body.id);
  res.redirect('/items');
});

// Display item update form on GET
exports.item_update_get = asyncHandler(async (req, res, next) => {
  const [item, categories] = await Promise.all([
    Item.findById(req.params.id),
    Category.find().exec(),
  ]);

  if (item === null) {
    const err = new Error('Item not found');
    err.status = 404;
    return next(err);
  }

  res.render('item_form', {
    title: 'Update Item',
    item: item,
    categories: categories,
  });
});

// Display item update form on POST
exports.item_update_post = [
  body('name', 'Name field must not be empty')
    .trim()
    .isLength({ min: 1 })
    .withMessage('Name needs to be at least 1 characters long')
    .isLength({ max: 100 })
    .withMessage('Name length cannot exceed 100 characters')
    .escape(),
  body('description', 'description field must not be empty')
    .trim()
    .isLength({ min: 10 })
    .withMessage('Description needs to be at least 10 characters long')
    .isLength({ max: 100})
    .withMessage('Description length cannot exceed 100 characters')
    .escape(),

  asyncHandler(async (req, res, next) => {
    const errors = validationResult(req);

    const item = new Item({
      name: req.body.name,
      description: req.body.description,
      category: req.body.category,
      price: req.body.price,
      nrInStock: req.body.nrInStock,
      _id: req.params.id,
    });

    if (!errors.isEmpty()) {
      const allCategories = await Category.find().exec();

      res.render('item_form', {
        title: 'Update Item',
        categories: allCategories,
        item: item,
        errors: errors.array(),
      }); 
      return;
    } else {

      await Item.findByIdAndUpdate(req.params.id, item, {});
      res.redirect(item.url);
    }
  }),
];