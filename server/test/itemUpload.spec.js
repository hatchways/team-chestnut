const chai = require("chai");
const chaiHttp = require("chai-http");
const app = require("../app.js");
const fs = require("fs");

chai.should();
chai.use(chaiHttp);


describe("/POST shop/item/:itemid", () => {
    it("it should return 200", done => {
      chai
        .request(app)
        .post(`/shop/item/5daa1254bc816877fe83e70c`)
        .set(
          "auth-token",
          "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJfaWQiOiI1ZGEwZGE1ZWZiZjVmYTM0OTNmODMyODMiLCJlbWFpbCI6Im5ha2thcmFwYWthQGdtYWlsLmNvbSIsIm5hbWUiOiJOYXJlc2ggQWtrYXJhcGFrYSIsImlhdCI6MTU3MTU5ODUzOX0.hE_WJIrgiG6HBnLZc1PleIj4MqlQDclwT0LxbWuWHjY"
        )
        .field("Content-Type", "multipart/form-data")
        .field("title", "Red Velvet Cake Delicious")
        .field(
          "description",
          "it is one of the best seller at our bakery. Not only does it look good, it also tastes great. You will never go wrong with this red velvet cake. Let us know if you need any specific modification to the cake done."
        )
        .field("price", 70)
        .field("category", "cake5")
        .attach(
          "image",
          fs.readFileSync(__dirname + "/cupcake.png"),
          __dirname + "/cupcake.png"
        )
        .end(function(err, res) {
          res.should.have.status(200);
          res.body.should.have.property("item").eql({
            photos: [
              "https://team-chestnut.s3.amazonaws.com/157101601079",
              "https://team-chestnut.s3.amazonaws.com/cupcake.png"
            ],
            _id: "5daa1254bc816877fe83e70c",
            title: "Red Velvet Cake Delicious",
            price: 70,
            description:
              "it is one of the best seller at our bakery. Not only does it look good, it also tastes great. You will never go wrong with this red velvet cake. Let us know if you need any specific modification to the cake done.",
            category: "cake5"
          });
          done();
        });
    });
  
    it("it should return 401", done => {
      chai
        .request(app)
        .post(`/shop/item/5daa1254bc816877fe83e70c`)
        .field("Content-Type", "multipart/form-data")
        .field("title", "Red Velvet Cake Delicious")
        .field(
          "description",
          "it is one of the best seller at our bakery. Not only does it look good, it also tastes great. You will never go wrong with this red velvet cake. Let us know if you need any specific modification to the cake done."
        )
        .field("price", 70)
        .field("category", "cake5")
        .attach(
          "image",
          fs.readFileSync(__dirname + "/cupcake.png"),
          __dirname + "/cupcake.png"
        )
        .end(function(err, res) {
          res.should.have.status(401);
          done();
        });
    });
  
    it("it should return 400, token invalid", done => {
      chai
        .request(app)
        .post(`/shop/item/5daa1254bc816877fe83e70c`)
        .set(
          "auth-token",
          "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJfaWQiOiI1ZGEwZGE1ZWZiZjVmYTM0OTNmODMyODMiLCJlbWFpbCI6Im5ha2thcmFwYWthQGdtYWlsLmNvbSIsIm5hbWUiOiJOYXJlc2ggQWtrYXJhcGFrYSIsImlhdCI6MTU3MTU5ODUzOX0.hE_WJIrgiG6HBnLZc1PleIj4MqlQDclwT0L"
        )
        .field("Content-Type", "multipart/form-data")
        .field("title", "Red Velvet Cake Delicious")
        .field(
          "description",
          "it is one of the best seller at our bakery. Not only does it look good, it also tastes great. You will never go wrong with this red velvet cake. Let us know if you need any specific modification to the cake done."
        )
        .field("price", 70)
        .field("category", "cake5")
        .attach(
          "image",
          fs.readFileSync(__dirname + "/cupcake.png"),
          __dirname + "/cupcake.png"
        )
        .end(function(err, res) {
          res.should.have.status(400);
          done();
        });
    });
  
    it("it should return 400, item not found", done => {
      chai
        .request(app)
        .post(`/shop/item/5daa1254bc816877fe83`)
        .set(
          "auth-token",
          "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJfaWQiOiI1ZGEwZGE1ZWZiZjVmYTM0OTNmODMyODMiLCJlbWFpbCI6Im5ha2thcmFwYWthQGdtYWlsLmNvbSIsIm5hbWUiOiJOYXJlc2ggQWtrYXJhcGFrYSIsImlhdCI6MTU3MTU5ODUzOX0.hE_WJIrgiG6HBnLZc1PleIj4MqlQDclwT0LxbWuWHjY"
        )
        .field("Content-Type", "multipart/form-data")
        .field("title", "Red Velvet Cake Delicious")
        .field(
          "description",
          "it is one of the best seller at our bakery. Not only does it look good, it also tastes great. You will never go wrong with this red velvet cake. Let us know if you need any specific modification to the cake done."
        )
        .field("price", 70)
        .field("category", "cake5")
        .attach(
          "image",
          fs.readFileSync(__dirname + "/cupcake.png"),
          __dirname + "/cupcake.png"
        )
        .end(function(err, res) {
          res.should.have.status(400);
          res.body.should.have.property("message").eql("Item not found...");
          done();
        });
    });
  });