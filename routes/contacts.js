const express = require('express');
const router = express.Router();
const auth = require('../middleware/auth');
const {check, validationResult} = require('express-validator');

const User = require('../models/User');
const Contact = require('../models/Contact');

//--------------------------------------------------------------------------------------------------------------------------
//The URL of these methods is: localhost:5000/api/contacts.

// @route | GET | api/contacts
// @desc  | Get all users contacts
// @access| Private

// Get all user's contacts
router.get('/', auth, async (req, res) => {
  try {
    // Find all contacts with that user by descending date order.
    const contacts = await Contact.find({user: req.user.id}).sort({
      date: -1,
    });
    res.json(contacts);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
});

//--------------------------------------------------------------------------------------------------------------------------

// @route | POST | api/contacts
// @desc  | Add new contact
// @access| Private

// Add a contact to the logged user
router.post('/', [auth, [
      check('name', 'Name is required').not().isEmpty(),
    ],
  ], async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({errors: errors.array()});
    }

    const {name, email, phone, type} = req.body;

    // We get the user for the new Contact constructor from the auth middleware(the user is still logged in).
    try {
      const newContact = new Contact({
        name,
        email,
        phone,
        type,
        user: req.user.id,
      });

      const contact = await newContact.save();

      res.json(contact);
    } catch (err) {
      console.error(err.message);
      res.status(500).send('Server Error');
    }
  },
);

//--------------------------------------------------------------------------------------------------------------------------
//*With PUT requests, we have to tell which contact we want to update.

// @route | PUT | api/contacts:id
// @desc  | Update contact
// @access| Private
//*('/:id') We are inside localhost:5000/api/contacts/someUserID URL when this Route is used.
router.put('/:id', auth, async (req, res) => {
  const {name, email, phone, type} = req.body;

  // Build contact object
  const contactFields = {};
  if (name) contactFields.name = name;
  if (email) contactFields.email = email;
  if (phone) contactFields.phone = phone;
  if (type) contactFields.type = type;

  try {
    let contact = await Contact.findById(req.params.id);

    if (!contact) return res.status(404).json({msg: 'Contact not found'});

    // Make sure user owns contact
    if (contact.user.toString() !== req.user.id) {
      return res.status(401).json({msg: 'Not authorized'});
    }

    contact = await Contact.findByIdAndUpdate(req.params.id, {$set: contactFields}, {new: true},);

    res.json(contact);
  } catch (err) {
    console.error(er.message);
    res.status(500).send('Server Error');
  }
});

//--------------------------------------------------------------------------------------------------------------------------
//*With DELETE requests, we have to tell which contact we want to delete

// @route | DELETE | api/contacts:id
// @desc  | Delete contact
// @access| Private
//*('/:id') We are inside localhost:5000/api/contacts/someUserID URL when this Route is used.
router.delete('/:id', auth, async (req, res) => {
  try {
    let contact = await Contact.findById(req.params.id);

    if (!contact) return res.status(404).json({msg: 'Contact not found'});

    // Make sure user owns contact
    if (contact.user.toString() !== req.user.id) {
      return res.status(401).json({msg: 'Not authorized'});
    }

    await Contact.findByIdAndRemove(req.params.id);

    res.json({msg: 'Contact removed'});
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
});

module.exports = router;