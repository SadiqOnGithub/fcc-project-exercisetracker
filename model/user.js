const mongoose = require('mongoose');


// make both the schemas
const userSchema = new mongoose.Schema({
	username: String,
	log: [{
		description: String,
		duration: Number,
		date: String,
		unix: Number
	}]
})

// make model
const User = mongoose.model('User', userSchema);


module.exports = User;