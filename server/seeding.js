const users = require("./schemas/users");
const shop = require("./schemas/shop");
const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");

const shopDetails = {
  title: "Maple Bakery",
  description:
    "Welcome to my bakery!. I've been baking for 8 years and have recently decided to expand online. I specialize in wedding cakes and party flavours.",
  cover_photo: "https://team-chestnut.s3.amazonaws.com/1570986365141"
};

const items = [
  {
    title: "Rose Wedding Cake",
    price: 120,
    description: "The tastiest wedding cake",
    category: "Cake",
    Photos: ["https://team-chestnut.s3.amazonaws.com/1571016207297"]
  },
  {
    title: "Macarons",
    price: 60,
    description: "It a delicious cookie of french style",
    category: "Cookie",
    Photos: ["https://team-chestnut.s3.amazonaws.com/157101601079"]
  },
  {
    title: "Rose Wedding Cake",
    price: 120,
    description: "The tastiest wedding cake",
    category: "Cake",
    Photos: ["https://team-chestnut.s3.amazonaws.com/1571016207297"]
  },
  {
    title: "Rose Wedding Cake",
    price: 120,
    description: "The tastiest wedding cake",
    category: "Cake",
    Photos: ["https://team-chestnut.s3.amazonaws.com/1571016207297"]
  },
  {
    title: "Rose Wedding Cake",
    price: 120,
    description: "The tastiest wedding cake",
    category: "Cake",
    Photos: ["https://team-chestnut.s3.amazonaws.com/1571016207297"]
  }
];

export default function seeding() {
  users.findOne({ email: "bakery@admin.com" }, function(err, found) {
    if (err) console.log("Error in users: ", err);
    if (found == null) {
      bcrypt.genSalt(10, function(err, salt) {
        bcrypt.hash("bakery", salt, function(err, hash) {
          console.log("hashed password is: ", hash);
          let user = new users({
            _id: new mongoose.Types.ObjectId(),
            name: "BakeryAdmin",
            email: "bakery@admin.com",
            password: hash
          });

          user.save(function(errs) {
            if (errs) return handleError(errs);
            console.log("user is saved");
            let sh = new shop({
              user: user._id,
              description: shopDetails.description,
              title: shopDetails.title,
              cover_photo: shopDetails.cover_photo,
              items: items
            });

            sh.save(function(e) {
              if (e) return handleError(e);
              console.log("Shop is saved");
            });
          });
        });
      });
    } else console.log("Found results: ", found);
  });
}
