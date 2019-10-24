const users = require("./schemas/users");
const shops = require("./schemas/shops");
const items = require("./schemas/items");
const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");

const shopDetails = {
  title: "Maple Bakery",
  description:
    "Welcome to my bakery!. I've been baking for 8 years and have recently decided to expand online. I specialize in wedding cakes and party flavours.",
  cover_photo: "https://team-chestnut.s3.amazonaws.com/1570986365141"
};

const allItems = [
  {
    title: "Rose Wedding Cake",
    price: 120,
    description: "The tastiest wedding cake",
    category: "Cake",
    photos: ["https://team-chestnut.s3.amazonaws.com/1571016207297"]
  },
  {
    title: "Macarons",
    price: 60,
    description: "It a delicious cookie of french style",
    category: "Cookie",
    photos: ["https://team-chestnut.s3.amazonaws.com/157101601079"]
  },
  {
    title: "Rose Wedding Cake",
    price: 120,
    description: "The tastiest wedding cake",
    category: "Cake",
    photos: ["https://team-chestnut.s3.amazonaws.com/1571016207297"]
  },
  {
    title: "Rose Wedding Cake",
    price: 120,
    description: "The tastiest wedding cake",
    category: "Cake",
    photos: ["https://team-chestnut.s3.amazonaws.com/1571016207297"]
  },
  {
    title: "Rose Wedding Cake",
    price: 120,
    description: "The tastiest wedding cake",
    category: "Cake",
    photos: ["https://team-chestnut.s3.amazonaws.com/1571016207297"]
  }
];

export default function seeding() {
  async function seed() {
    const user = await users.findOne({ email: "bakery@admin.com" });

    if (user === null) {
      const salt = await bcrypt.genSalt(10);
      const hashedPassword = await bcrypt.hash("bakery", salt);

      const newuser = new users({
        _id: new mongoose.Types.ObjectId(),
        name: "BakeryAdmin",
        email: "bakery@admin.com",
        password: hashedPassword
      });

      const savedUser = await newuser.save();

      console.log("saved user", savedUser);

      const shop = new shops({
        user: savedUser._id,
        description: shopDetails.description,
        title: shopDetails.title,
        cover_photo: shopDetails.cover_photo,
        items: []
      });

      const savedShop = await shop.save();

      console.log("saved shop", savedShop);

      let itemId = [];
      await asyncForEach(allItems, async (item, i) => {
        let newItem = new items({
          _id: new mongoose.Types.ObjectId(),
          title: item.title,
          price: item.price,
          description: item.description,
          category: item.category,
          photos: item.photos
        });

        let savedItem = await newItem.save();

        itemId.push(savedItem._id);
      });

      savedShop.items = itemId;

      const newShop = await savedShop.save();

      console.log("new shop", newShop);
    }
  }

  async function asyncForEach(array, callback) {
    for (let index = 0; index < array.length; index++) {
      await callback(array[index], index, array);
    }
  }

  seed();
}

