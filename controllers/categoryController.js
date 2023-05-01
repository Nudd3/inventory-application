const Category = require('../models/category');
const Item = require('../models/item');
const asyncHandler = require('express-async-handler');
const { body, validationResult } = require('express-validator');

// Display list of all categories
exports.category_list = asyncHandler(async (req, res, next) => {
  const allCategories = await Category.find({}, 'name description');

  res.render('category_list', {
    title: 'Category List',
    category_list: allCategories,
  });
});

// Display detail page for a specific category
exports.category_detail = asyncHandler(async (req, res, next) => {
  const [category, itemsInCategory] = await Promise.all([
    Category.findById(req.params.id).exec(),
    Item.find({ category: req.params.id }, 'name price').exec(),
  ]);

  if (category === null) {
    // No results
    const err = new Error('Category not found');
    err.status = 404;
    return next(err);
  }

  res.render('category_detail', {
    title: 'Category Detail',
    category: category,
    category_items: itemsInCategory,
  });
});

// Display Category create form on GET
exports.category_create_get = (req, res, next) => {
  res.render('category_form', { title: 'Create Category' });
};

// Display Category create form on POST
exports.category_create_post = [
  // Validate and sanitize the name and description fields
  body('name', 'Category name must be at least 3 characters long')
    .trim()
    .isLength({ min: 3 })
    .escape(),
  body('description', 'Category description must be present and between 3 and 100 characters')
    .trim()
    .isLength({ min: 3, max: 100 })
    .escape(),

  // Process request after validation and sanitization
  asyncHandler(async (req, res, next) => {
    // Extract the validation errors from a request
    const errors = validationResult(req);

    // Create a category object with escaped and timmed data
    const category = new Category({ name: req.body.name, description: req.body.description });

    if (!errors.isEmpty()) {
      // Errors! Render the form again with sanitized values/error messages
      res.render('category_form', {
        title: 'Create Category',
        category: category,
        errors: errors.array(),
      });
      return;
    } else {
      // Form data is valid
      // Check if Category already exists
      const categoryExists = await Category.findOne({ name: req.body.name }).exec();

      if (categoryExists) {
        // Already exists. Redirect to its detail page
        res.redirect(categoryExists.url);
      } else {
        await category.save();
        // New category saved. Redirect to its detail page
        res.redirect(category.url);
      }
    }
  }),
];

// Display Category delete form on GET
exports.category_delete_get = asyncHandler(async (req, res, next) => {
  // Get details of category
  const [category, itemsInCategory] = await Promise.all([
    Category.findById(req.params.id).exec(),
    Item.find({ category: req.params.id }, 'name price').exec(),
  ]);

  if (category === null) {
    res.redirect('/categories');
  }

  res.render('category_delete', {
    title: 'Delete Category',
    category: category,
    category_items: itemsInCategory,
  });

});

// Display Category delete form on POST
exports.category_delete_post = asyncHandler(async (req, res, next) => {
  const [category, itemsInCategory] = await Promise.all([
    Category.findById(req.params.id).exec(),
    Item.find({ category: req.params.id }, 'name price').exec(),
  ]);

  if (itemsInCategory.length > 0) {
    // Category has items => Cannot be deleted
    // Render in the same way as for GET route
    res.render('category_delete', {
      title: 'Delete Category',
      category: category,
      category_items: itemsInCategory,
    });
    return
  } else {
    // Category has no items => can be deleted
    await Category.findByIdAndRemove(req.body.categoryid);
    res.redirect('/categories');
  }
});

// Display Category update form on GET
exports.category_update_get = asyncHandler(async (req, res, next) => {

  const category = await Category.findById(req.params.id).exec();

  if (category === null) {
    const err = new Error('Category not found');
    err.status = 404;
    return next(err);
  }

  res.render('category_form', {
    title: 'Update Category',
    category: category,
  });
});

// Display Category update form on POST
exports.category_update_post = [

  // Validate and sanitize the name and description fields
   body('name', 'Category name must be at least 3 characters long')
   .trim()
   .isLength({ min: 3 })
   .escape(),
 body('description', 'Category description must be present and between 3 and 100 characters')
   .trim()
   .isLength({ min: 3, max: 100 })
   .escape(),

  asyncHandler(async (req, res, next) => {
    const errors = validationResult(req);

    // Create a Category object with the new values and old id
    const category = new Category({
      name: req.body.name,
      description: req.body.description,
      _id: req.params.id,
    });

    if (!errors.isEmpty()) {
      // Errors. re-render form

      res.render('category_form', {
        title: 'Update Category',
        category: category,
        errors: errors.array(),
      });
      return;
    } else {
      const theCategory = await Category.findByIdAndUpdate(req.params.id, category, {});
      res.redirect(theCategory.url);
    }
  }),
];
