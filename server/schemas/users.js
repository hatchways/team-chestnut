let mongoose = require('mongoose');
//Users SCHEMA 
let usersSchema = new mongoose.Schema({
    id: Number,
    account_type: String,
    first_name: String,
    last_name: String,
    address: String,
    city: String,
    region: String,
    zipcode: String,
    phone: Number,
    email: String,
    hashed_password: String,
    image_src: String,
    status: String
});


module.exports = mongoose.model('users', usersSchema);