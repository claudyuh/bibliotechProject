const express = require('express');
const catchAsync = require('../utils/catchAsync')
const { reviewValidation } = require('../middleware/dbFormatsValidation')
const {isLoggedIn, isReviewUser} = require('../middleware/middlewareAuthorization')
const { createReview, deleteReview, getValues } = require('../controllers/reviews')
const router = express.Router()


router.route('/:id/reviews')
        .post(isLoggedIn, reviewValidation, catchAsync(createReview))

router.route('/:id/reviews/:reviewId')
        .delete(isLoggedIn, isReviewUser, catchAsync(deleteReview))

router.route('/:id/reviews/:reviewId/votes')
        .post(isLoggedIn , catchAsync(getValues))


module.exports = router

