const express = require('express');
const catchAsync = require('../utils/catchAsync');
const { searchBook } = require('../controllers/search');
const router = express.Router()

//  Description: This gets the search results matches with DB and shows the result
//  Access: Public
router.route('/search')
    .get(catchAsync(searchBook))


module.exports = router;
