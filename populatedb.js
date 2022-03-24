#! /usr/bin/env node

console.log(
    'This script populates some test books, authors, genres and bookinstances to your database. Specified database as argument - e.g.: populatedb mongodb+srv://cooluser:coolpassword@cluster0.a9azn.mongodb.net/local_library?retryWrites=true'
);

// Get arguments passed on command line
var userArgs = process.argv.slice(2);
/*
if (!userArgs[0].startsWith('mongodb')) {
    console.log('ERROR: You need to specify a valid mongodb URL as the first argument');
    return
}
*/
var async = require('async');
var Category = require('./models/category');
var Item = require('./models/item');

var mongoose = require('mongoose');
var mongoDB = userArgs[0];
mongoose.connect(mongoDB, { useNewUrlParser: true, useUnifiedTopology: true });
mongoose.Promise = global.Promise;
var db = mongoose.connection;
db.on('error', console.error.bind(console, 'MongoDB connection error:'));

var categories = [];
var items = [];

function categoryCreate(name, description, cb) {
    categorydetail = { name: name, description: description };

    var category = new Category(categorydetail);

    category.save(function (err) {
        if (err) {
            cb(err, null);
            return;
        }
        console.log('New Category: ' + category);
        categories.push(category);
        cb(null, category);
    });
}

function itemCreate(name, description, category, price, number_in_stock, cb) {
    itemdetail = {
        name: name,
        description: description,
        category: category,
        price: price,
        number_in_stock: number_in_stock,
    };

    var item = new Item(itemdetail);
    item.save(function (err) {
        if (err) {
            cb(err, null);
            return;
        }
        console.log('New Item: ' + item);
        items.push(item);
        cb(null, item);
    });
}

function createCategories(cb) {
    async.series(
        [
            function (callback) {
                categoryCreate(
                    'Brass',
                    'Make sound when air is blown inside.',
                    callback
                );
            },
            function (callback) {
                categoryCreate(
                    'Percussion',
                    'Make sound when they are hit, shaken, or whatever else will make the instrument vibrate and thus produce a sound.',
                    callback
                );
            },
            function (callback) {
                categoryCreate(
                    'Strings',
                    "The sound comes from strings' vibration.",
                    callback
                );
            },
            function (callback) {
                categoryCreate(
                    'Woodwinds',
                    'Produce sound when air (wind) is blown inside, where it vibrates.',
                    callback
                );
            },
            function (callback) {
                categoryCreate(
                    'Strings2',
                    "The sound comes from strings' vibration.",
                    callback
                );
            },
        ],
        // optional callback
        cb
    );
}

function createItems(cb) {
    async.parallel(
        [
            function (callback) {
                itemCreate(
                    'Trumpet',
                    'Brass musical instrument of part cylindrical, part conical bore, in the shape of a flattened loop and having three piston valves to regulate the pitch.',
                    categories[0],
                    130,
                    2,
                    callback
                );
            },
            function (callback) {
                itemCreate(
                    'Trombone',
                    'Brass wind musican instrument of cylindrical bore, twice bent on itself, having a sliding section that lengthens or shortens it and thus regulates the pitch.',
                    categories[0],
                    200,
                    1,
                    callback
                );
            },
            function (callback) {
                itemCreate(
                    'Bungle',
                    'Brass wind musical instrument consisting of a conical tube coiled once upon itself, capable of producing five or six harmonics.',
                    categories[0],
                    79,
                    5,
                    callback
                );
            },
            function (callback) {
                itemCreate(
                    'Drums',
                    'Drums, what more to say.',
                    categories[1],
                    99,
                    10,
                    callback
                );
            },
            function (callback) {
                itemCreate(
                    'Cymbals',
                    'They consist of a pair of slightly concave metal plates which produce a vibrant sound of indeterminate pitch.',
                    categories[1],
                    29,
                    1,
                    callback
                );
            },
            function (callback) {
                itemCreate(
                    'Triangle',
                    'In mathematics, plane figure bounded by three straight lines, the sides, which intersect at three points called the vertices.',
                    categories[1],
                    34,
                    5,
                    callback
                );
            },
            function (callback) {
                itemCreate(
                    'Violin',
                    'Family of stringed musical instruments having wooden bodies whose backs and fronts are slightly convex, the fronts pierced by two ƒ-shaped resonance holes.',
                    categories[2],
                    300,
                    2,
                    callback
                );
            },
            function (callback) {
                itemCreate(
                    'Cello',
                    'Subtype of a violin',
                    categories[2],
                    499,
                    1,
                    callback
                );
            },
            function (callback) {
                itemCreate(
                    'Guitar',
                    "It's a guitar, dude.",
                    categories[2],
                    99,
                    8,
                    callback
                );
            },
            function (callback) {
                itemCreate(
                    'Flute',
                    'The tone of all flutes is produced by an airstream directed against an edge, producing eddies that set up vibrations in the air enclosed in the attached tube.',
                    categories[3],
                    84,
                    6,
                    callback
                );
            },
            function (callback) {
                itemCreate(
                    'Clarinet',
                    'Musical wind instrument of cylindrical bore employing a single reed.',
                    categories[3],
                    79,
                    1,
                    callback
                );
            },
        ],
        // optional callback
        cb
    );
}

async.series(
    [createCategories, createItems],
    // Optional callback
    function (err, results) {
        if (err) {
            console.log(categories)
            console.log('FINAL ERR: ' + err);
        } else {
            console.log('Categories: ' + categories);
            console.log('Items: ' + items);
        }
        // All done, disconnect from database
        mongoose.connection.close();
    }
);
