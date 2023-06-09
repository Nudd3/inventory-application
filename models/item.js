const mongoose = require('mongoose');

const Schema = mongoose.Schema;

const ItemSchema = new Schema({
  name: { type: String, required: true },
  description: { type: String, required: true, minLength: 3, maxLength: 100 },
  category: { type: Schema.Types.ObjectId, ref: 'Category', required: true },
  price: { type: mongoose.Types.Decimal128, required: true },
  nrInStock: { type: Number, required: true },
});

ItemSchema.virtual('url').get(function () {
  return `/item/${this._id}`;
});

module.exports = mongoose.model('Item', ItemSchema);