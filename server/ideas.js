const express = require('express');
const ideasRouter = express.Router();

const {
	getAllFromDatabase,
	getFromDatabaseById,
	addToDatabase,
	updateInstanceInDatabase,
	deleteFromDatabasebyId,
} = require('./db');
const checkMillionDollarIdea = require('./checkMillionDollarIdea');

// /api/ideas routes
// GET /api/ideas
// get an array of all ideas in the database
ideasRouter.get('/', (req, res, next) => {
	// Return the full ideas collection.
	const ideas = getAllFromDatabase('ideas');
	res.send(ideas);
});

// POST /api/ideas
// create a new idea and save it to the database
// checkMillionDollarIdea middleware ensures the idea is profitable enough
ideasRouter.post('/', checkMillionDollarIdea, (req, res, next) => {
	try {
		// Persist the request body as a new idea record.
		const newIdea = addToDatabase('ideas', req.body);
		if (!newIdea) {
			// Invalid payload should return a bad request status.
			return res.status(400).send();
		}
		// Return the created idea with a 201 status code.
		return res.status(201).send(newIdea);
	} catch (error) {
		// db helpers throw when types/schema are invalid.
		return res.status(400).send();
	}
});

// GET /api/ideas/:ideaId
// get a single idea by id
ideasRouter.get('/:ideaId', (req, res, next) => {
	// Find one idea by id from route parameters.
	const idea = getFromDatabaseById('ideas', req.params.ideaId);
	if (!idea) {
		return res.status(404).send();
	}
	return res.send(idea);
});

// PUT /api/ideas/:ideaId
// update a single idea by id
ideasRouter.put('/:ideaId', (req, res, next) => {
	// Guard clause: update only makes sense if the target idea exists.
	const existingIdea = getFromDatabaseById('ideas', req.params.ideaId);
	if (!existingIdea) {
		return res.status(404).send();
	}

	// Reuse the same profitability rule for updates.
	checkMillionDollarIdea(req, res, () => {
		try {
			// Keep URL id as the source of truth for which record is updated.
			const updateData = { ...req.body, id: req.params.ideaId };
			const updatedIdea = updateInstanceInDatabase('ideas', updateData);
			if (!updatedIdea) {
				// Existing id but invalid update fields.
				return res.status(400).send();
			}
			return res.status(200).send(updatedIdea);
		} catch (error) {
			// Any schema/type validation failure maps to bad request.
			return res.status(400).send();
		}
	});
});

// DELETE /api/ideas/:ideaId
// delete a single idea by id
ideasRouter.delete('/:ideaId', (req, res, next) => {
	// deleteFromDatabasebyId returns false if the id does not exist.
	const deletedIdea = deleteFromDatabasebyId('ideas', req.params.ideaId);
	if (!deletedIdea) {
		return res.status(404).send();
	}
	// Successful delete returns 204 with no body.
	return res.status(204).send();
});

module.exports = ideasRouter;
