#! /usr/bin/env node

console.log(
  'This script populates the database with some test items and categories. Specified database as argument'
);

// Get arguments passed on command line
const userArgs = process.argv.slice(2);

const Item = require('./models/item');
const Category = require('./models/category');

const items = [];
const categories = [];

const mongoose = require('mongoose');
mongoose.set('strictQuery', false); 

const mongoDB = userArgs[0];

main().catch((err) => console.log(err));

async function main() {
  console.log('Debug: About to connect');
  await mongoose.connect(mongoDB);
  console.log('Debug: Should be connected');
  await createCategories();
  await createItems();
  console.log('Debug: Closing mongoose');
  mongoose.connection.close();
}

async function categoryCreate(name, description) {
  const category = new Category({ name: name, description: description });
  await category.save();
  categories.push(category);
  console.log(`Added category: ${name}`);
}

async function itemCreate(name, description, price, nrInStock, category) {
  itemDetail = {
    name: name,
    description: description,
    price: price,
    nrInStock: nrInStock,
  };
  if (category != false) itemDetail.category = category;

  const item = new Item(itemDetail);
  await item.save();
  items.push(item);
  console.log(`Added item: ${name}`);
}

async function createCategories() {
  console.log('Adding categories');
  await Promise.all([
    categoryCreate('T-shirts', 'Comfy t-shirts'),
    categoryCreate('Pants', 'Whatever style you fancy, look no further'),
    categoryCreate('Hoodies', 'Warm and good looking'),
    categoryCreate('Shoes', 'Boots, sneakers or high heels. You want it, we have it'),
  ]);
}

async function createItems() {
  console.log('Adding items');
  await Promise.all([
    itemCreate(
      'T-shirt white', 
      'As comfortable as it looks', 
      9.99, 
      8, 
      categories[0]
    ),
    itemCreate(
      'T-shirt blue', 
      'Stylish blue shirt with modern textures', 
      12.49, 
      5, 
      categories[0]
    ),
    itemCreate(
      'Jeans blue', 
      'Slim fit', 
      14.99, 
      9, 
      categories[1]
    ),
    itemCreate(
      'Jeans black', 
      'Slim fit jeans with torn knees', 
      17.99, 
      9, 
      categories[1]
    ),
    itemCreate(
      'Hoodie red', 
      'Oversized hoodie', 
      19.99, 
      5, 
      categories[2]
    ),
    itemCreate(
      'Hoodie green', 
      'Oversized hoodie', 
      19.99, 
      5, 
      categories[2]
    ),
    itemCreate(
      'Hoodie pink', 
      'Oversized hoodie', 
      19.99, 
      5, 
      categories[2]
    ),
    itemCreate(
      'Shoes white', 
      'Thin sole', 
      25, 
      10, 
      categories[3]
    ),
    itemCreate(
      'Shoes red', 
      'Thin sole', 
      25, 
      10, 
      categories[3]
    ),
    itemCreate(
      'Shoes black', 
      'Thin sole', 
      25, 
      10, 
      categories[3]
    ),
  ]);
}