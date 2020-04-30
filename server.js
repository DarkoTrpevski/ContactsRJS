//*Entry point to our backend
const express = require('express');

// Init express
const app = express();

// Add a Route for get request
app.get('/', (req, res) => {
    res.json({ msg: 'Welcome to the ContactKeeper API...' });
});


// Define Routes:
//*Whenever we hit this URL (/api/something), we will require following routes
app.use('/api/users', require('./routes/users'));
app.use('/api/contacts', require('./routes/contacts'));
app.use('/api/auth', require('./routes/auth'));

// Init port
const PORT = process.env.PORT || 5000;

// App listen
app.listen(PORT, () => console.log(`Server started on port ${PORT}`) )