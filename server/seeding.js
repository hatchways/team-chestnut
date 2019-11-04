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
    price: 10,
    description: "The tastiest wedding cake",
    category: "Cakes",
    photos: ["https://team-chestnut.s3.amazonaws.com/1a350ede83e5c0c4b87586c0d4bad0f66b86da37.png"]
  },
  {
    title: "Macarons",
    price: 5,
    description: "It a delicious cookie of french style",
    category: "Macarons",
    photos: ["https://team-chestnut.s3.amazonaws.com/1a350ede83e5c0c4b87586c0d4bad0f66b86da37.png"]
  },
  {
    title: "Rose Wedding Cake",
    price: 4,
    description: "The tastiest wedding cake",
    category: "Cupcakes",
    photos: ["https://team-chestnut.s3.amazonaws.com/1a350ede83e5c0c4b87586c0d4bad0f66b86da37.png"]
  },
  {
    title: "Rose Wedding Cake",
    price: 25,
    description: "The tastiest wedding cake",
    category: "Cakes",
    photos: ["https://team-chestnut.s3.amazonaws.com/1a350ede83e5c0c4b87586c0d4bad0f66b86da37.png"]
  },
  {
    title: "Rose Wedding Cake",
    price: 15,
    description: "The tastiest wedding cake",
    category: "Cakes",
    photos: ["https://team-chestnut.s3.amazonaws.com/1a350ede83e5c0c4b87586c0d4bad0f66b86da37.png"]
  },
  {
    title: "Rose Wedding Cake",
    price: 32,
    description: "The tastiest wedding cake",
    category: "Cupcakes",
    photos: ["https://team-chestnut.s3.amazonaws.com/1a350ede83e5c0c4b87586c0d4bad0f66b86da37.png"]
  },
  {
    title: "Macarons",
    price: 28,
    description: "It a delicious cookie of french style",
    category: "Cookies",
    photos: ["https://team-chestnut.s3.amazonaws.com/1a350ede83e5c0c4b87586c0d4bad0f66b86da37.png"]
  },
  {
    title: "Rose Wedding Cake",
    price: 38,
    description: "The tastiest wedding cake",
    category: "Cakes",
    photos: ["https://team-chestnut.s3.amazonaws.com/1a350ede83e5c0c4b87586c0d4bad0f66b86da37.png"]
  },
  {
    title: "Rose Wedding Cake",
    price: 40,
    description: "The tastiest wedding cake",
    category: "Cupcakes",
    photos: ["https://team-chestnut.s3.amazonaws.com/1a350ede83e5c0c4b87586c0d4bad0f66b86da37.png"]
  },
  {
    title: "Rose Wedding Cake",
    price: 41,
    description: "The tastiest wedding cake",
    category: "Cakes",
    photos: ["https://team-chestnut.s3.amazonaws.com/1a350ede83e5c0c4b87586c0d4bad0f66b86da37.png"]
  },
  {
    title: "Rose Wedding Cake",
    price: 30,
    description: "The tastiest wedding cake",
    category: "Cupcakes",
    photos: ["https://team-chestnut.s3.amazonaws.com/1a350ede83e5c0c4b87586c0d4bad0f66b86da37.png"]
  },
  {
    title: "Macarons",
    price: 9,
    description: "It a delicious cookie of french style",
    category: "Macarons",
    photos: ["https://team-chestnut.s3.amazonaws.com/1a350ede83e5c0c4b87586c0d4bad0f66b86da37.png"]
  },
  {
    title: "Rose Wedding Cake",
    price: 50,
    description: "The tastiest wedding cake",
    category: "Cakes",
    photos: ["https://team-chestnut.s3.amazonaws.com/1a350ede83e5c0c4b87586c0d4bad0f66b86da37.png"]
  },
  {
    title: "Rose Wedding Cake",
    price: 22,
    description: "The tastiest wedding cake",
    category: "Cakes",
    photos: ["https://team-chestnut.s3.amazonaws.com/1a350ede83e5c0c4b87586c0d4bad0f66b86da37.png"]
  },
  {
    title: "Rose Wedding Cake",
    price: 32,
    description: "The tastiest wedding cake",
    category: "Cakes",
    photos: ["https://team-chestnut.s3.amazonaws.com/1a350ede83e5c0c4b87586c0d4bad0f66b86da37.png"]
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

