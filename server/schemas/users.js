let mongoose = require('mongoose');
//Users SCHEMA 
let usersSchema = new mongoose.Schema({
    first_name: String,
    last_name: String,
    address: String,
    city: String,
    region: String,
    zipcode: String,
    phone: Number,
    email: String,
    password: String,
});


module.exports = mongoose.model('users', usersSchema);