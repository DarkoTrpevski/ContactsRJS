const express = require('express');
const router = express.Router();
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const config = require('config');
const auth = require('../middleware/auth');
const {check, validationResult} = require('express-validator');
const User = require('../models/User');

//--------------------------------------------------------------------------------------------------------------------------

//*Since we want this to be a protected method, we will include the middleware function as a parameter.

// @route | GET | api/auth
// @desc  | Get loggged in user
// @access| Private

//*Authenticate logged in user
router.get('/', auth, async (req, res) => {
  try {
    const user = await User.findById(req.user.id).select('-password');
    res.json(user);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
});

//--------------------------------------------------------------------------------------------------------------------------

// @route | POST | api/auth
// @desc  | Send data to get authenticated
// @access| Public

//*Login user (validate)
router.post('/', [
    check('email', 'Please include a valid email').isEmail(),
    check('password', 'Password is required').exists(),
  ],
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({errors: errors.array()});
    }

    const {email, password} = req.body;

    try {
      // Checking if emails match
      let user = await User.findOne({email});
      if (!user) {
        return res.status(400).json({msg: 'Invalid Credentials'});
      }

      // Checking if password match
      const isMatch = await bcrypt.compare(password, user.password);
      if (!isMatch) {
        return res.status(400).json({msg: 'Invalid Credentials'});
      }

    //*Json web token consists of: HEADER, PAYLOAD, AND VERIFY SIGNATURE. The user id will be our payload.
      const payload = {
        user: {
          id: user.id,
        },
      };

      // Sign the token using the payload and the secret key from default.json
      jwt.sign(payload, config.get('jwtSecret'), {
          // Options
          expiresIn: 360000,
        },
        (err, token) => {
          if (err) throw err;
          res.json({token});
        },
      );
    } catch (err) {
      console.error(err.message);
      res.status(500).send('Server Error');
    }
  },
);

//--------------------------------------------------------------------------------------------------------------------------

module.exports = router;