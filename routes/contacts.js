//*Routes:
// CRUD Users/Contacts relation

const express = require('express');
const router = express.Router();


//*Now we will create the requests using the router to communicate with our servyr.js file

// @route | GET | api/contacts
// @desc  | Get all users contacts
// @access| Private
//*('/') We are inside the localhost:5000/api/contacts URL when this Route is used.
router.get('/', (req, res) => {
    res.send('Get all contacts');
});

// @route | POST | api/contacts
// @desc  | Add new contact
// @access| Private
//*('/') We are inside the localhost:5000/api/contacts URL when this Route is used.
router.post('/', (req, res) => {
    res.send('Add new contact');
});

//*With PUT requests, we have to tell which contact we want to update
// @route | PUT | api/contacts:id
// @desc  | Update contact
// @access| Private
//*('/:id') We are inside localhost:5000/api/contacts/someUserID URL when this Route is used.
router.put('/:id', (req, res) => {
    res.send('Update contact');
});

//*With DELETE requests, we have to tell which contact we want to delete
// @route | DELETE | api/contacts:id
// @desc  | Delete contact
// @access| Private
//*('/:id') We are inside localhost:5000/api/contacts/someUserID URL when this Route is used.
router.delete('/:id', (req, res) => {
    res.send('Delete contact');
});

module.exports = router;