const User = require('../models/userModel')
const Book = require('../models/bookModel')
const Review = require('../models/reviewModel')
const randomString = require('randomstring');
const { response } = require('express');
// @description: Renders the Register form
// @route: GET  >  /register
// @access: Public
exports.renderRegister = (req, res, next) => {
    res.render('userLoginReg/userRegister')
}

// @description: Creates a new user
// @route: POST  >  /register
// @access: Public
exports.createUser = async(req, res, next) => {
  
    const {email, username, firstname, lastname, password, confirmPassword, date} = req.body; 
    //password match condition
    if(password != confirmPassword){
        req.flash('error', 'Passwords do not match, please try again!');
        return res.redirect('/register');
    }
    const user = new User({email, username, firstname, lastname, date})
    const registeredUser = await User.register(user, password)
    req.login(registeredUser, err => {
        if(err) return next(err);
    });

    req.flash('success', 'Welcome to the club!')
    res.redirect('/allbooks?category=&rent=&reviewScore=&price=&pg=1')
    next()
}

exports.deleteUser = async(req, res, next) => {
    const user = req.user;
    // TO WORK ON
    res.redirect('/myaccount')
}

// @description: renders my account form
// @route: POST  >  /myaccount
// @access: Private
exports.renderMyAccount = async (req, res, next) => {
    const user = req.user;
    const fullName = `${user.firstname} ${user.lastname}`;
    function capitalize(fullName) {  
        var words = fullName.split(/-| /);  
        var CapitalizedWords = [];  
        words.forEach(element => {  
            CapitalizedWords.push(element[0].toUpperCase() + element.slice(1, element.length));  
        });  
        return CapitalizedWords.join(' ');  
    }
    const capFullName = capitalize(fullName);
    const reviews = await Review.find();
    const books = await Book.find();
    res.render('userLoginReg/accountManager', {user, capFullName, reviews, books});
}

// @description: Change the password of the user
// @route: POST  >  /myaccount/changepassword
// @access: Private

exports.changePass = async (req, res, next) => {
    const {oldPassword, newPassword, confirmPassword} = req.body
    const {_id, email, username} = req.user;
    if(oldPassword === newPassword) {
        req.flash("error", "The new password has to be different.");
        return res.redirect("/myaccount");
    } else if (newPassword !== confirmPassword){
        req.flash("error", "Confirmation error, confirm password has to match the new password!");
        return res.redirect("/myaccount");
    };
    // if password is wrong is gonna throw error
    try {
        const foundUser =  await User.findById(_id)
        await foundUser.changePassword(oldPassword, newPassword)
        req.flash("success", "Password changed successfully and an email has been sent!");
        next();
        return res.redirect('/myaccount')
    } catch (error) {
        console.log(error)
    }
    
    req.flash("error", "Check if you entered your password exactly")
    res.redirect('/allbooks');
}


// @description: Render page form
// @route: POST  >  /forgot
// @access: Public

exports.renderForgotPass = (req, res, next) => {
    res.render('userLoginReg/forgotPass')
}


// @description:  Reset password
// @route: POST  >  /forgot
// @access: Public with Authorization

exports.forgotPass = async (req, res, next) => {
    const {email, username} = req.body;
    const user = await User.findOne({"email": email, "username": username })
    if(user){
        const temporaryPass = randomString.generate(10);
        console.log(temporaryPass)
        req.temporaryPass = temporaryPass;
            try {
                await user.setPassword(temporaryPass)
                await user.save();
            } catch (error) {
                req.flash('error', 'Ops something went wrong')
                return res.redirect('/')
            }
        req.flash("success", "We just sent you an email")
        res.redirect('/') 
        return next()
    } else {
        req.flash("error", "Some details are incorrect")
        res.redirect('/') 
    }
    return
}


// @description: Renders login form 
// @route: GET  >  /login
// @access: Public
exports.renderLogin =  (req, res, next) => {
    res.render('userLoginReg/userLogin')
}

// @description: Login a user
// @route: POST  >  /login
// @access: Public
exports.login =  function(req, res, next){
    res.redirect('/allBooks')
}

// @description: Terminates a cookie session, logout user
// @route: GET  >  /logout
// @access: Private
exports.logout =  (req, res, next) => {
    req.logout();
    req.flash('success', 'Successfully logged out')
    res.redirect('/allbooks?category=&rent=&reviewScore=&price=&pg=1')
}

// @description: Wishlist page
// @route: GET  >  /myaccount/wishlist
// @access: Private
exports.renderWishlist = async (req, res, next) => {
    const wish = req.user.wishlist;
    const lst = []
    for(let i = 0; i < wish.length; i++){
        const books = await Book.findById({_id: wish[i]})
        lst.push(books)
    }
    res.render('userLoginReg/wishlist', {lst})
}

// @description: Adds to USER Wishlist
// @route: Post  >  /myaccount/wishlist
// @access: Private
exports.createWishlist = async (req, res, next) => {
    const bookId = req.body.sendSvr;
    const user = req.user;
    user.wishlist.push(bookId)
    console.log("WISHLIST Book ID: ", bookId)
    await user.save()
}


// @description: Removes from USER Wishlist
// @route: Post  >  /myaccount/wishlist/delete
// @access: Private
exports.deleteWishlist = async (req, res, next) => {
    const deleteFromWL = req.body.deleteFromWish;
    const deleteId = req.body.deleteId;
    const user = req.user;
    if(deleteFromWL){
        console.log("DELETE FROM WL")
        await user.updateOne({$pull: {wishlist: deleteFromWL}})
        await user.save()
        res.redirect('/myaccount/wishlist')
    } else {
        console.log("DELETE FROM ALLBOOKS")
        await user.updateOne({$pull: {wishlist: deleteId}})
        await user.save()
    }
    
}




