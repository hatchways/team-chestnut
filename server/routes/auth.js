const router = require('express').Router();
const User = require('../schemas/users');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const { registerValidation, loginValidation } = require('../validation');

router.post('/register', async (req, res) => {
    // validate data before 
    console.log('requested register')
    const { error } = registerValidation(req.body);
    console.log(`Error var: ${error}`);
    if (error) {
        return res.status(400).send(error.details[0].message)
    }
    console.log(`req body: ${req.body.toString()}`);
    // check if user already registered in the database
    const emailExists = await User.findOne({email: req.body.email});
    console.log(`Emailexists var:${emailExists}`);
    if (emailExists) return res.status(400).send('Email already registered.')
    
    // hash passwords
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(req.body.password, salt);

    // create new user
    const user = new User({
        name: req.body.name,
        email: req.body.email,
        password: hashedPassword
    });
    console.log(user);
    try {
        const savedUser = await user.save();
        res.send(`User: ${savedUser.id}`);
    } catch (err) {
        res.status(400).send(err);
    }
})

// login
router.post('/login', async (req, res) => {
    // validate user before 
    const { error } = loginValidation(req.body);
    if (error) {
        return res.status(400).send(error.details[0].message)
    }
    // check if user exists
    const user = await User.findOne({email: req.body.email});
    if (!user) return res.status(400).send('Email is not found.');
    // password is correct
    const validPass = await bcrypt.compare(req.body.password, user.password);
    if (!validPass) return res.status(400).send('Email or password is incorrect.');
    // create and assign token
    const token = jwt.sign({_id: user._id}, process.env.TOKEN_SECRET);
    res.header('auth-token', token).send(token);
});

module.exports = router;