const { cloudinary } = require('../cloudinary');
const Book = require('../models/bookModel');
const User = require('../models/userModel')
const Review = require('../models/reviewModel')
const ExpressError = require('../utils/ExpressError')
const colors = require('colors')

// @description: Get all books
// @route: GET > /allbooks
// @access: Public
             
exports.getBooks = async(req, res, next) => {
    const currentPage = parseInt(req.query.pg)
    const {reviewScore, rent, price, category} = req.query
    let cnt;
    let cntFilter;
    let pages;
    const lst = {
        'reviewScore': parseInt(reviewScore),  
        'rent':rent, 
        'price':parseInt(price),
        'category':category 
    }
    var books = []
    // console.log(">>".bgRed.black, lst, "<<".bgRed.black)
    
    // Function to filter DB by criteria
    function myFilter(){
        if ( lst.category !== '' && lst.rent !== '' ) {
            return  {'category': lst.category, 'rent': true}
        } else if( lst.category !== '' && lst.rent === '' ) {
            return  {'category': lst.category}
        } else if ( lst.category === '' && lst.rent !== '' ){
            return {'rent': true}
        } else {
            return {}
        }
    }

    // Function to sort DB by criteria
    function mySorter(){
        if ( !isNaN(lst.reviewScore) && !isNaN(lst.price) ) {
            return [['reviewScore', lst.reviewScore], ['price', lst.price]]
        } else if(!isNaN(lst.reviewScore) && isNaN(lst.price) ) {
            return [['reviewScore', lst.reviewScore]]
        } else if ( isNaN(lst.reviewScore) && !isNaN(lst.price) ){
            return [['price', lst.price]]
        } else {
            return ''
        }
    }

    
    if( isNaN(lst.reviewScore) && isNaN(lst.price) && lst.rent === '' && lst.category === ''){
        cnt = await Book.find().countDocuments();
        pages = Math.ceil(cnt /25);

        if(currentPage == 1){
            cnt;
            pages;
            books = await Book.find({}).limit(25);
        } else {
            cnt;
            pages;
            books = await Book.find({}).skip(25 * (currentPage-1)).limit(25);
        }
    } else {
        cntFilter = await Book.find(myFilter())
        cntFilter = cntFilter.length;

        if(currentPage == 1){
            cntFilter;
            pages = Math.ceil(cntFilter /25)
            books = await Book.find(myFilter()).sort(mySorter()).limit(25);
        } else {
            cntFilter;
            pages = Math.ceil(cntFilter /25)
            books = await Book.find(myFilter()).sort(mySorter()).skip(25 * (currentPage-1)).limit(25);
        }
    }

    res.render(`books/allBooks`, {books, pages, currentPage, reviewScore, rent, price, category, cnt, cntFilter});
}

// @description: Render form
// @route: GET > /allbooks/newBook
// @access: Public with Auth
exports.getNewBook = (req, res, next) => {
    res.render('books/newBook')
}

// @description: Post Book
// @route: POST > /allbooks
// @access: Public with Auth
exports.createBook = async(req, res, next) => {
    const newBook = new Book(req.body)
    const currentUser= req.user   
    newBook.user = currentUser
    newBook.images = req.files.map(f => ({ url: f.path, filename: f.filename }));
    await newBook.save()
    req.flash('success', " You've successfully posted a new book.")
    res.redirect(`/allbooks?category=&rent=&reviewScore=&price=&pg=1`)
}

// @description: Shows single book by id
// @route: GET  >  /allbooks/:id
// @access: Public
exports.showBook = async(req, res, next) => {
    const {id} = req.params
    const book = await Book.findById(id)
            .populate({path:'reviews', options: {sort: {'reviewPoints' : -1, 'date' : -1}}, populate:{path:'user'}})
            .populate('user')
    if(!book) return next(new ExpressError("No book found or the page has been deleted", 404))
    // avg rating from reviews for each book
    let sum = 0; let cnt = 0 
    if(book.reviews.length){
        for(let i of book.reviews){
            sum += i.rating;
            cnt += 1;
        }
        var avg = sum/cnt
        avg = avg.toFixed(1)
    };
    book.reviewScore = avg
    const nrOfReviews = book.reviews.length;
    await book.save();
    res.render('books/indexBook', {book, avg, nrOfReviews, id })
}

// @description: Renders the edit book Form
// @route: GET  >  /allbooks/:id/edit
// @access: Private
exports.renderEditBook = async(req, res, next) => {
    const {id} = req.params
    const book = await Book.findById(id)
    res.render('books/editBook', {book}) 
}

// @description: Updates the book with new values
// @route: PUT  >  /allbooks/:id/edit
// @access: Private
exports.updateBook = async(req, res, next) => {
    const { id } = req.params
    const book = await Book.findByIdAndUpdate(id, { ...req.body} );
    const imgs = req.files.map(f => ({ url: f.path, filename: f.filename }));
    book.images.push(...imgs);
    if(req.body.deleteImg){
        for(let filename of req.body.deleteImg){
            await cloudinary.uploader.destroy(filename)
        }
        await book.updateOne({ $pull: { images: { filename: { $in: req.body.deleteImg } } } })
    }

    await book.save()
    req.flash('success', " You've successfully edited the book.")
    res.redirect(`/allbooks/${book._id}`)
}

// @description: Deletes a single book
// @route: DELETE  >  /allbooks/:id
// @access: Private
exports.deleteBook = async(req, res, next) => {
    const { id } = req.params;
    const book = await Book.findById(id);
    for (let i of book.images){
        let files = i.filename
        await cloudinary.uploader.destroy(files)
    }
    await Book.findByIdAndDelete(id);
    console.log("BOOK ID:", id)
    // await User.updateMany({ $pull: {wishlist: id}})
    req.flash('success', " You've successfully deleted the book.")
    res.redirect('/allbooks?category=&rent=&reviewScore=&price=&pg=1');
}

