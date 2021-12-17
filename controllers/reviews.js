const Book = require('../models/bookModel');
const Review = require('../models/reviewModel');
const User = require('../models/userModel')

// @description: Adding one point to review
// @route: POST > /allbooks/:id/reviews/reviewId/values
// @access: Public with Auth

exports.getValues = async(req, res, next) => {
    const { id, reviewId } = req.params;
    const user = req.user;
    const book = await Book.findById(id);
    const review = await Review.findById(reviewId);
    
    if(review.usersVoted.includes(user._id)){
        await review.updateOne({$pull:{usersVoted: user._id}});
        review.reviewPoints = parseInt(review.reviewPoints) -1;
        await review.save();
    } else if(!review.usersVoted.includes(user._id)) {
        const points = parseInt(review.reviewPoints) + 1;
        review.reviewPoints = points;
        review.usersVoted.push(user.id);
        await review.save();
    };
    res.redirect(`/allbooks/${book.id}`);
}

// @description: Create a new review
// @route: POST > /allbooks/:id/reviews
// @access: Public with auth

exports.createReview = async(req, res, next) => {
    const book = await Book.findById(req.params.id);
    const review = new Review(req.body);
    const user = req.user;
    review.user = req.user._id;
    book.reviews.push(review);
    user.userReviews.push(review);
    review.user = user;
    review.usersVoted.push(user.id);
    review.reviewedBook = book;
    // upvote function below
    await user.save();
    await review.save();
    await book.save();
    console.log("REVIEW ID: ", review.id)
    // flash request for test
    req.flash('success', " You've successfully posted the review.");
    res.redirect(`/allbooks/${book._id}`)
}


// @description: Delete a review
// @route: DELETE > /allbooks/:id/reviews/reviewId
// @access: Private

exports.deleteReview = async(req, res) => {
    const { id, reviewId } = req.params;
    const currentUser = req.user._id;
    await Book.findByIdAndUpdate(id, {$pull: {reviews: reviewId}});
    await Review.findByIdAndDelete(reviewId)
    await User.findByIdAndUpdate(currentUser, {$pull: {userReviews: reviewId}})
    
    req.flash('success', " You've successfully deleted the review.")
    res.redirect(`/allbooks/${id}`)
}