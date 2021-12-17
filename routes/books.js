const express = require('express');
const router = express.Router();
const { getBooks, 
        getNewBook, 
        createBook, 
        showBook, 
        renderEditBook, 
        updateBook, 
        deleteBook } = require('../controllers/books')
const  {isLoggedIn, theBookOwner} = require('../middleware/middlewareAuthorization')
const catchAsync = require('../utils/catchAsync')
const multer = require('multer');
const { storage } = require('../cloudinary');
const upload = multer({ storage });


router.route('/')
        .get(catchAsync(getBooks))
        .post(isLoggedIn, upload.array('image'), catchAsync(createBook))

router.get('/newbook', isLoggedIn, getNewBook)

router.route('/:id')
        .get(catchAsync(showBook))
        .delete(isLoggedIn, theBookOwner, catchAsync(deleteBook))

router.route('/:id/edit')
        .get(isLoggedIn, theBookOwner, catchAsync(renderEditBook))
        .put(isLoggedIn, theBookOwner, upload.array('image'), catchAsync(updateBook))



module.exports = router;