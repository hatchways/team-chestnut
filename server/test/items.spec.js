const chai = require("chai");
const chaiHttp = require("chai-http");
const sinon = require("sinon");
const multer = require("multer");
const MulterWrapper = require("../modules/multer");
const jwt = require("jsonwebtoken");
const mongoose = require("mongoose");
const Mockgoose = require("mockgoose").Mockgoose;
const mockgoose = new Mockgoose(mongoose);
const fs = require("fs");

// sinon has to stub the middleware before the app is created. Otherwise it will not stub the middleware.
sinon
  .stub(MulterWrapper, "multer")
  .returns(multer({ storage: multer.memoryStorage() }));

const app = require("../app.js");

chai.should();
chai.use(chaiHttp);
let userMock;

function registerUser(name, email, password, cb) {
  chai
    .request(app)
    .post("/auth/register")
    .send({ name, email, password })
    .end((err, res) => {
      if (cb) {
        cb(err, res);
      }
    });
}

function registerShop(authToken, cb) {
  chai
    .request(app)
    .post(`/shop/register-shop/${userMock._id}`)
    .set("auth-token", authToken)
    .send({title:'new Shop', description:'this is a test'})
    .end((err, res) => {
      if (cb) {
        cb(err, res);
      }
    });
}

describe("Testing Items ", () => {
  before(done => {
    mockgoose.prepareStorage().then(() => {
      mongoose.connect(
        process.env.TEST_DB,
        { useNewUrlParser: true, useUnifiedTopology: true },
        () => {
          done();
        }
      );
    });
  });

  describe("User, Shop, Item registration, updating", () => {
    let shopMock;
    let authToken;
    let mockItem;

    before(done => {
      registerUser(
        "testtesttest",
        "testing@test.com",
        "bakery1",
        (err, res) => {
          authToken = res.body.token;
          userMock = jwt.decode(authToken);
          registerShop(authToken, (err, res) => {
            shopMock = res.body.shop;
            done();
          });
        }
      );
    });

    after(done => {
      MulterWrapper.multer.restore();
      done();
    });
    it("Register a new items", done => {
      chai
        .request(app)
        .post(`/shop/items/new-item/${userMock._id}`)
        .set("auth-token", authToken)
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
          __dirname + "/testImage.png"
        )
        .end((err, res) => {
          mockItem = res.body.item;
          res.should.have.status(200);
          res.body.should.be.an("object");
          chai.expect(res.body).to.not.be.empty;
          res.body.should.have
            .property("item")
            .to.include.all.keys(
              "photos",
              "_id",
              "title",
              "price",
              "description",
              "__v"
            );

          done();
        });
    });

    it("Item update returns 200", done => {
      chai
        .request(app)
        .put(`/shop/items/${mockItem._id}`)
        .set("auth-token", authToken)
        .field("Content-Type", "multipart/form-data")
        .field("title", "Red Velvet Cake")
        .field(
          "description",
          "it is one of the best seller at our bakery. Not only does it look good, it also tastes great. You will never go wrong with this red velvet cake. Let us know if you need any specific modification to the cake done."
        )
        .field("price", 20)
        .field("category", "bakery")
        .attach(
          "image",
          fs.readFileSync(__dirname + "/cupcake.png"),
          __dirname + "/cupcake.png"
        )
        .end(function(err, res) {
          res.should.have.status(200);
          res.body.should.be.an("object");
          chai.expect(res.body).to.not.be.empty;
          res.body.should.have.property("item").eql({
            photos: [null],
            _id: mockItem._id,
            title: "Red Velvet Cake",
            price: 20,
            description:
              "it is one of the best seller at our bakery. Not only does it look good, it also tastes great. You will never go wrong with this red velvet cake. Let us know if you need any specific modification to the cake done.",
            category: "bakery"
          });
          done();
        });
    });

    it("Item update, should return 401", done => {
      chai
        .request(app)
        .put(`/shop/items/${mockItem._id}`)
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
          res.body.should.be.an("object");
          chai.expect(res.body).to.not.be.empty;
          res.body.should.have.property("message").eql("Access Denied");
          done();
        });
    });

    it("Item update, return 400, token invalid", done => {
      chai
        .request(app)
        .put(`/shop/items/${mockItem._id}`)
        .set("auth-token", "12345")
        .field("Content-Type", "multipart/form-data")
        .field("title", "Red Velvet Cake")
        .field(
          "description",
          "it is one of the best seller at our bakery. Not only does it look good, it also tastes great. You will never go wrong with this red velvet cake. Let us know if you need any specific modification to the cake done."
        )
        .field("price", 70)
        .field("category", "cake")
        .attach(
          "image",
          fs.readFileSync(__dirname + "/cupcake.png"),
          __dirname + "/cupcake.png"
        )
        .end(function(err, res) {
          res.should.have.status(400);
          res.body.should.be.an("object");
          chai.expect(res.body).to.not.be.empty;
          res.body.should.have.property("message").eql("Invalid Token");
          done();
        });
    });

    it("it should return 400, item not found", done => {
      chai
        .request(app)
        .put(`/shop/items/123456`)
        .set("auth-token", authToken)
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
          res.body.should.be.an("object");
          chai.expect(res.body).to.not.be.empty;
          res.body.should.have.property("message").eql("Item not found...");
          done();
        });
    });
  });
});
