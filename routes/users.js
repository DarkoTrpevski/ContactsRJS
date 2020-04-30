//*Register Users Route
const express = require('express');
const router = express.Router();

//*Now we will create the requests using the router to communicate with our server.js file

// @route | POST | api/users
// @desc  | Register an user
// @access| Public(token)
//*('/') We are inside the localhost:5000/api/users URL when this Route is used.
router.post('/', (req, res) => {
    res.send('Register an user');
});

module.exports = router;