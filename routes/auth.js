//*Routes:
// Login
// Auth
// Check logged in User
const express = require('express');
const router = express.Router();

//*Now we will create the requests using the router to communicate with our server.js file

// @route | GET | api/auth
// @desc  | Get loggged in user
// @access| Private
//*('/') We are inside the localhost:5000/api/auth URL when this Route is used.
router.get('/', (req, res) => {
    res.send('Get logged in user');
});

// @route | POST | api/auth
// @desc  | Send data to get authenticated
// @access| Public
//*('/') We are inside the localhost:5000/api/auth URL when this Route is used.
router.post('/', (req, res) => {
    res.send('Authenticate user');
});

module.exports = router;