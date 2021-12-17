const Book = require('../models/bookModel');
// search form from navbar
exports.searchBook = async (req, res) => {
    let search = req.query.search
    let books = await Book.find().or([ { "author": { "$regex": search, "$options": "i" } }, 
    { "title": { "$regex": search, "$options": "i" } } ]).limit(50)
    const cnt = books.length
    res.render('books/search', {books, search, cnt})
}
