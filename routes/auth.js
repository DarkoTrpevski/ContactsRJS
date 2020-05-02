const express = require('express');
const router = express.Router();
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const config = require('config');
const auth = require('../middleware/auth');
const {check, validationResult} = require('express-validator');

const User = require('../models/User');
//The URL of these methods is: localhost:5000/api/auth

//------------------------------------------------------------------------------------------------------------

/*

//*Validate logged in user
router.get('/', auth, async (req, res) => {
    try {
        // Because we got the logged in user, using our middleware we can access all of it's properties.
        // To get only the user without the password we use ( select('-password') ).
      const user = await User.findById(req.user.id).select('-password');
      res.json(user);
    } catch (err) {
      console.error(err.message);
      res.status(500).send('Server Error');
    } 
  });

//------------------------------------------------------------------------------------------------------------

// @route | POST | api/auth
// @desc  | Send data to get authenticated
// @access| Public

//*Authenticate user
router.post('/', [
    check('email', 'Please include valid email').isEmail(),
    check('password', 'Password is required').isLength({ min: 6 })
], async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({errors: errors.array()});
    } else {
        const { email, password } = req.body;

        try {
            // Checking if emails match
            let user = await User.findOne({ email: email });
            if(!user) {
                return res.status(400).json({ msg: 'Invalid credentials' })
            } else {
                // Checking if password match
                const isMatch = await bcrypt.compare(password, user.password);
                if(!isMatch) {
                    return res.status(400).json({ msg: 'Invalid credentials' })
                } else{
                //*Json web token consists of: HEADER, PAYLOAD, AND VERIFY SIGNATURE.
                // The user id will be our payload
                const payload = {
                    id: user.id
                }
                // Sign the token using the payload and the secret key from default.json
                jwt.sign(payload, config.get('jwtSecret'), {
                    // Options
                    expiresIn: 3600000
                }, (err, token) => {
                    // Callback function
                    if(err) {
                        throw err;
                    } else {
                        res.json({ token })
                    }
                });
                }
            }
        } catch (err) {
            console.error(err.message);
            res.status(500).send('Server error');
        }
    }
});

*/

//------------------------------------------------------------------------------------------------------------
//*Since we want this to be a protected method, we will include the middleware function as a parameter.

// @route | GET | api/auth
// @desc  | Get loggged in user
// @access| Private

//*Validate logged in user
router.get('/', auth, async (req, res) => {
  try {
    const user = await User.findById(req.user.id).select('-password');
    res.json(user);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
});

// @route     POST api/auth
// @desc      Auth user & get token
// @access    Public
router.post(
  '/',
  [
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
      let user = await User.findOne({email});

      if (!user) {
        return res.status(400).json({msg: 'Invalid Credentials'});
      }

      const isMatch = await bcrypt.compare(password, user.password);

      if (!isMatch) {
        return res.status(400).json({msg: 'Invalid Credentials'});
      }

      const payload = {
        user: {
          id: user.id,
        },
      };

      jwt.sign(
        payload,
        config.get('jwtSecret'),
        {
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

module.exports = router;