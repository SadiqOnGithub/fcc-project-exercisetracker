require('dotenv').config()
const express = require('express')
const mongoose = require('mongoose');
const cors = require('cors');

// custom module
const { errorHandler } = require('./middleware/errorHandler');


// connect to database
const mySecret = process.env['MONGO_DB_URI'] || 'mongodb://127.0.0.1:27017/exerciseTracker';
mongoose.connect(mySecret);
mongoose.connection.on('error', (err) => console.log("mongoose connection error", err));


// config
const app = express();


// middleware
app.use(cors())
app.use(express.urlencoded({ extended: false }));
app.use(express.static('public'))


// routes
app.get('/', (req, res) => res.sendFile(__dirname + '/views/index.html'));
app.use('/api', require('./router/api'))


// err
app.use(errorHandler);


const listener = app.listen(process.env.PORT || 3000, () => {
	console.log('Your app is listening on port ' + listener.address().port)
})
