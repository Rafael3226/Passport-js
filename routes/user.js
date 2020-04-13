const express = require('express');
const router = express.Router();
const passport = require('passport');
const BearerStrategy = require('passport-http-bearer').Strategy;

// User Model
const User = require('../models/user');

// Configure the Bearer strategy for use by Passport.
//
// The Bearer strategy requires a `verify` function which receives the
// credentials (`token`) contained in the request.  The function must invoke
// `cb` with a user object, which will be set at `req.user` in route handlers
// after authentication.

passport.use(
    new BearerStrategy(
        function(token, done) {
            User.findOne({ token: token }, 
                function (err, user) {
                    if (err) { return done(err); }
                    if (!user) { return done(null, false); }
                    return done(null, user, { scope: 'all' });
                }
            );
        }
    )
);


// GET all user
router.get('/', 
    passport.authenticate('bearer', { session: false }),
    async (req, res) => {
    const user = await User.find().catch(err => res.status(400).json('Error: ' + err));
    res.json(user);
});

// GET all users
router.get('/:id', 
    passport.authenticate('bearer', { session: false }),
    async (req, res) => {
    const user = await User.findById(req.params.id).catch(err => res.status(400).json('Error: ' + err));
    res.json(user);
});

// ADD a new user
router.post('/', 
    passport.authenticate('bearer', { session: false }),
    async (req, res) => {
    console.log(req.body);
    const { username , token , displayName , email } = req.body;
    const user = new User({ username , token , displayName , email });
    await user.save().catch(err => console.log(err));
    res.json({status: 'user Saved'});
});

// UPDATE an user
router.put('/:id', 
    passport.authenticate('bearer', { session: false }),
    async (req, res) => {
    const { username , token , displayName , email } = req.body;
    const newuser = { username , token , displayName , email };
    await User.findByIdAndUpdate(req.params.id, newuser).catch(err => res.status(400).json('Error: ' + err));
    res.json({status: 'user Updated'});
});

router.delete('/:id', 
    passport.authenticate('bearer', { session: false }),
    async (req, res) => {
    await User.findByIdAndRemove(req.params.id).catch(err => res.status(400).json('Error: ' + err));
    res.json({status: 'user Deleted'});
});

module.exports = router;