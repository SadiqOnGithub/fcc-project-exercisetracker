const express = require('express');
const { getAllUsers, postUser, postUserExercise, getUserExercises } = require('../controller/api');
const router = express.Router();


// GET all users in format
router.get('/users', getAllUsers)

// POST /api/users
router.post('/users', postUser)

// POST /api/users/:_id/exercises
router.post('/users/:_id/exercises', postUserExercise)

// GET /api/users/:_id/logs?[from][&to][&limit]
router.get('/users/:_id/logs', getUserExercises);


module.exports = router;