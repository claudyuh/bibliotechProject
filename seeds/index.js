const faker = require('faker')
const dotenv = require('dotenv').config()
const mongoose = require('mongoose');
const Book = require('../models/bookModel')
const User = require('../models/userModel')
const Review = require('../models/reviewModel')

const cloudDB = process.env.MONGO_URI

mongoose.connect(cloudDB, {
    useNewUrlParser: true,
    useCreateIndex: true,
    useUnifiedTopology: true,
    useFindAndModify: false
});

const db = mongoose.connection;
db.on("error", console.error.bind(console, "connection error:"));
db.once("open", () => {
    console.log(`Mongoose(Atlas) connected`);
});


function getRndInteger(min, max) {
    return Math.floor(Math.random() * (max - min + 1) ) + min;
  }

function getFullName (){
    return  faker.name.firstName() + " " + faker.name.lastName();
}

const lst = ['Poetry', 'Fiction', 'Mistery', 'Biography', 'Drama', 'Nonfiction', 'Technical']
const rnt1 = ['true', 'false']

seedBooks = async() =>{
    // Delete all data and resync
    
    await Book.deleteMany({});
    await Review.deleteMany({});
    await User.updateMany({ $set : {userReviews: []}})
    await User.updateMany({ $set: { wishlist: [] } })
    
    for (let i = 0; i < 1500; i++){
        const book = new Book({
            title : faker.random.words(getRndInteger(1,4)),
            author : getFullName(),
            pages :getRndInteger(4,1000),
            description : faker.lorem.words(85),
            edition: getRndInteger(1,20),
            year: getRndInteger(1400,2021),
            category: lst[getRndInteger(0,6)],
            price: getRndInteger(1,350),
            rent: rnt1[getRndInteger(0,1)],
            user: {
                _id: "614b20a1a7677c3130492501" ,
                ref: 'User'
            }
        });
        await book.save()

    }
}


seedBooks().then(() => {
    mongoose.connection.close();
})

