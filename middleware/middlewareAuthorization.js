const ExpressError = require('../utils/ExpressError');
const Book = require('../models/bookModel');
const Review = require('../models/reviewModel');


module.exports.isLoggedIn = (req, res, next) => {
    if(!req.isAuthenticated()) {
        req.session.returnTo = req.OriginalUrl;
        req.flash('error','You must be logged in first!');
        return res.redirect('/login');
    }
    next();
}

module.exports.theBookOwner = async(req, res, next) => {
    const {id} = req.params;
    const book = await Book.findById(id);
    if(!book.user.equals(req.user._id)){
        req.flash('error', 'You do not have permission to do that!');
        return res.redirect(`/allBooks/${id}`);
    }
    next()
}

module.exports.isReviewUser = async(req, res, next) => {
    const {id, reviewId} = req.params;
    const review = await Review.findById(reviewId);
    if(!review.user.equals(req.user._id)){
        req.flash('error', 'You do not have permission to do that!');
        return res.redirect(`/allBooks/${id}`);
    }
    next();
}

module.exports.isTheUser = (req, res, next) => {
    if(req.user.equals()) {
        req.session.returnTo = req.OriginalUrl;
        req.flash('error','You must be logged in first!');
        return res.redirect('/login');
    }
    next();
}






