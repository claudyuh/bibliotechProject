const express = require('express');
const catchAsync = require('../utils/catchAsync')
const passport = require('passport');
const nodemailer = require("nodemailer");
const { renderRegister, 
        renderLogin, 
        createUser, 
        login, 
        logout, 
        renderMyAccount, 
        changePass, 
        renderForgotPass, 
        forgotPass, 
        deleteUser, 
        renderWishlist, 
        createWishlist, 
        deleteWishlist} = require('../controllers/users');
const { userValidation } = require('../middleware/dbFormatsValidation');
const { isLoggedIn } = require('../middleware/middlewareAuthorization');
const { registerEmail, changedPasswordEmail, forgotPasswordEmail } = require('../middleware/emailerMiddleware')
const router = express.Router()


router.route('/register')
        .get(renderRegister)
        .post(userValidation, catchAsync(createUser), registerEmail)


router.route('/login')
        .get(renderLogin)
        .post(passport.authenticate('local', {successRedirect: "/allbooks?category=&rent=&reviewScore=&price=&pg=1", 
                                                failureRedirect: '/login', 
                                                successFlash: 'Welcome!', 
                                                failureFlash: 'Invalid username or password' }))
  
router.route('/logout')
        .get(logout)

router.route('/myaccount')
        .get(isLoggedIn ,catchAsync(renderMyAccount))

router.route('/changepassword')
        .post(isLoggedIn, catchAsync(changePass), changedPasswordEmail)

router.route('/forgot')
        .get(renderForgotPass)
        .post(catchAsync(forgotPass), forgotPasswordEmail)

router.route('/myaccount/deleteaccount')
        .delete(isLoggedIn ,deleteUser)

router.route('/myaccount/wishlist')
        .get(isLoggedIn, renderWishlist)
        .post(isLoggedIn ,createWishlist)

router.route('/myaccount/wishlist/delete')
        .post(isLoggedIn, deleteWishlist)


module.exports = router;



