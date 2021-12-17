const mongoose = require("mongoose")
const Review = require('./reviewModel')
const User = require('./userModel')

const ImageSchema = new mongoose.Schema({
    url: String,
    filename: String
});

ImageSchema.virtual('thumbnail').get(function () {
    return this.url.replace('/upload', '/upload/w_150');
});

const BookSchema = new mongoose.Schema({ 
    title: {
        type: String, 
        lowercase: true, 
        trim: true 
        },
    author: {
        type: String, 
        lowercase: true, 
        trim: true 
        },
    pages: Number,
    description: String,
    edition: Number,
    year: Number,
    images: [ImageSchema],
    category:{
        type: String,
        enum: ['Poetry', 'Fiction', 'Mistery', 'Biography', 'Drama', 'Nonfiction', 'Technical'],
    },
    price: Number,
    rent: Boolean,
    reviewScore: Number,
    user:{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User'
        },
    reviews: 
        [
            {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'Review'
            }
        ]
 });



BookSchema.post('findOneAndDelete', async(doc) => {
    if(doc){
        const x = doc._id
        const y = doc.reviews
        console.log(x, y)
        console.log("MIDDLEWARE findOneAndDelete (delete document references) was triggered")
        await Review.deleteMany( { _id: { $in: doc.reviews } } )
        await User.updateMany( { $pull: { userReviews: {$in: doc.reviews} } } )
        await User.updateMany( { $pull: { wishlist: doc._id} } )
    }
})


module.exports = mongoose.model('Book', BookSchema)