const mongoose = require('mongoose');

const Schema = mongoose.Schema;

const CategorySchema = new Schema({
  name: { type: String, required: true, minLength: 3 },
  description: { type: String, required: true, minLength: 10, maxLength: 100 },
});

CategorySchema.virtual('url').get(function () {
  return `/category/${this._id}`;
});

module.exports = mongoose.model('Category', CategorySchema);