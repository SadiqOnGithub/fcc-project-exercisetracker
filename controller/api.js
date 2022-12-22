const User = require('../model/user');

const getAllUsers = async (req, res) => {

	try {
		// retrieve allUsers
		const allUsers = await User.find();

		// format allUsers
		const formattedUsers = allUsers.map((user) => {
			const { username, _id } = user;
			return { username, _id }
		})

		// send formattedUser
		return res.json(formattedUsers);
	}
	catch (err) {
		console.log(err);
	}
	return res.json({ error: "oops! something went wrong" });
};


const postUser = async (req, res) => {
	// receive and prepare userData
	var { body: { username } } = req

	try {
		var { username, _id } = await User.create({ username });
		// send response
		return res.json({ username, _id })
	}
	catch (error) {
		console.log(error);
	}
	// send general response
	return res.json({ error: "oops! something went wrong" });
};


const postUserExercise = async (req, res) => {
	// receive data
	const { body: { description, duration, date }, params: { _id } } = req
	const preparedLogData = {
		unix: date ? new Date(date).getTime() : new Date().getTime(),
		date: date ? new Date(date).toDateString() : new Date().toDateString(),
		duration: parseInt(duration),
		description
	};
	// retrieve object
	try {
		const userData = await User.findById(_id);
		if (!userData) return res.json({ error: "user not found" });

		// push preparedData to log
		userData.log.push(preparedLogData)
		// save the doc
		const updatedUser = await userData.save();

		// preparing return data
		let returnObj = {
			_id,
			username: updatedUser.username,
			date: preparedLogData.date,
			duration: preparedLogData.duration,
			description
		}

		// sending the response
		!updatedUser && res.json({ error: "oops! something went wrong" });
		return updatedUser && res.json(returnObj)

	}
	catch (err) {
		// const {message, _message, errors} = err;
		console.log({ err })
	}
	// send general response
	return res.json({ error: "oops! something went wrong" });
};


const getUserExercises = async (req, res) => {
	var count, fromUnix, from, toUnix, to;
	const { params: { _id }, query: { from: fromDate, to: toDate, limit } } = req;

	if (fromDate && toDate) {
		var fromUnix = new Date(fromDate).getTime();
		var from = new Date(fromDate).toDateString();
		var toUnix = new Date(toDate).getTime();
		var to = new Date(toDate).toDateString();
	}

	try {
		// retrieve userData by ID
		const userData = await User.find({ _id }).exec()
		var { username, log } = userData[0];
		count = log.length;
		if (fromDate && toDate) {
			// reassignment of log 
			log = log.filter((exercise) => (exercise.unix >= fromUnix && exercise.unix <= toUnix))
			// count based on new length of the log
			count = log.length;
		}

		// deleting _id and unix property
		log = log.map(exercise => {
			const { description, duration, date } = exercise;
			return { description, duration, date };
		})

		// limiting the log
		log = log.slice(0, limit)

		return res.json({
			_id, username, from, to, count, log
		})
	}
	catch (err) {
		console.log(err);
	}
	res.json({ error: 'oops! something went wrong' })
};

module.exports = { getAllUsers, postUser, postUserExercise, getUserExercises }