const router = require("express").Router();
const User = require("../schemas/users");
const Order = require("../schemas/orders");
const Address = require("../schemas/address");
const stripe = require("stripe")("sk_test_...");
const verify = require("./verify-token");

router.post("/checkout/", verify, async (req, res, next) => {
  // need to make payment,
  // need customers id, and items, quantiy,
  // user details... if registered user and shipping is same dont update the addresses, else update address
  //

  const userid = req.params.userid;

  // retrive the user... to verify if the user exists. else do i need to create a user?...
  logger.log("info", `User id is ${userid}`);

  const user = await User.findOne(
    { _id: userid },
    { __v: false, password: false, date: false }
  );

  if (!user) return res.status(400).send({ message: "User is not found..." });
  logger.log("info", "The user details is", user.toJSON());

  // retrive users address and check with shipping address?...

  // saving ship address
  const shipAddress = new Address({
    user: userid,
    address: req.body.ship.address,
    postalcode: req.body.ship.postalcode,
    city: req.body.ship.city,
    country: req.body.ship.country,
    phone: req.body.phone,
    current: false
  });

  const shipAddress = await Address.save().catch(err => {
    logger.error(`the database error in saving address is ${err}`);
  });

  if (!shipAddress) {
    return res.status(400).send({ message: "Order could not be saved" });
  }

  // saving the order
  const order = new Order({
    user: userid,
    totalPrice: req.body.price,
    totalQuanity: req.body.quantity,
    status: "new-order",
    shipTo: shipAddress._id
  });

  req.orders.forEach(item => {
    order.orders.push({ items: item._id, quantity: item.quantiy });
  });

  const saveOrder = await Order.save().catch(err => {
    logger.error(`the database error in saving order is ${err}`);
  });

  if (!saveOrder) {
    return res.status(400).send({ message: "Order was not able to be saved" });
  }
});

// when do i create the customer
if (!user.stripeId) {
  const customer = await stripe.customers.create(
    {
      email: user.email
    },
    {
      timeout: 1000
    }
  );

  if (customer) {
    // update the stripeId of the user

    // and create source
    const source = await stripe.customers.createSource(customer.id, {
        source: req.body.sToken,
      });

    // charge the customer
    
  }
}
// create source? do i need this?....



// charge the customer
const chargedCustomer = await stripe.charges.create(
  {
    amount: req.body.price,
    currency: "cad",
    source: req.body.sToken, // obtained with Stripe.js
    metadata: { order_id: saveOrder._id },
    customer: user.stripeId, // need to check this...
  },
  {
    idempotency_key: saveOrder._id
  },
  function(err, charge) {} // dont worry for now. 
);


// 400 when charged failed...

module.exports = router;






// response from charge...

// {
//     "id": "ch_1FeDET2eZvKYlo2Ckmevc823",
//     "object": "charge",
//     "amount": 100,
//     "amount_refunded": 0,
//     "application": null,
//     "application_fee": null,
//     "application_fee_amount": null,
//     "balance_transaction": "txn_19XJJ02eZvKYlo2ClwuJ1rbA",
//     "billing_details": {
//       "address": {
//         "city": null,
//         "country": null,
//         "line1": null,
//         "line2": null,
//         "postal_code": null,
//         "state": null
//       },
//       "email": null,
//       "name": "Jenny Rosen",
//       "phone": null
//     },
//     "captured": false,
//     "created": 1573618409,
//     "currency": "usd",
//     "customer": null,
//     "description": "My First Test Charge (created for API docs)",
//     "dispute": null,
//     "disputed": false,
//     "failure_code": null,
//     "failure_message": null,
//     "fraud_details": {},
//     "invoice": null,
//     "livemode": false,
//     "metadata": {
//       "order_id": "6735"
//     },
//     "on_behalf_of": null,
//     "order": null,
//     "outcome": null,
//     "paid": true,
//     "payment_intent": null,
//     "payment_method": "card_19yUNL2eZvKYlo2CNGsN6EWH",
//     "payment_method_details": {
//       "card": {
//         "brand": "visa",
//         "checks": {
//           "address_line1_check": null,
//           "address_postal_code_check": null,
//           "cvc_check": "unchecked"
//         },
//         "country": "US",
//         "exp_month": 12,
//         "exp_year": 2020,
//         "fingerprint": "Xt5EWLLDS7FJjR1c",
//         "funding": "credit",
//         "installments": null,
//         "last4": "4242",
//         "network": "visa",
//         "three_d_secure": null,
//         "wallet": null
//       },
//       "type": "card"
//     },
//     "receipt_email": null,
//     "receipt_number": null,
//     "receipt_url": "https://pay.stripe.com/receipts/acct_1032D82eZvKYlo2C/ch_1FeDET2eZvKYlo2Ckmevc823/rcpt_GAYLZim67PSMW5Y5w8W3hMbbu3WTQdF",
//     "refunded": false,
//     "refunds": {
//       "object": "list",
//       "data": [],
//       "has_more": false,
//       "url": "/v1/charges/ch_1FeDET2eZvKYlo2Ckmevc823/refunds"
//     },
//     "review": null,
//     "shipping": null,
//     "source_transfer": null,
//     "statement_descriptor": null,
//     "statement_descriptor_suffix": null,
//     "status": "succeeded",
//     "transfer_data": null,
//     "transfer_group": null
//   }
