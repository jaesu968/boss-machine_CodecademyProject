const express = require('express');
const minionsRouter = express.Router();

const {
	getAllFromDatabase,
	getFromDatabaseById,
	addToDatabase,
	updateInstanceInDatabase,
	deleteFromDatabasebyId,
} = require('./db');

// /api/minions routes
// GET /api/minions
// get an array of all minions in the database
minionsRouter.get('/', (req, res, next) => {
	// Read the full minion collection and return it as JSON.
	const minions = getAllFromDatabase('minions');
	res.send(minions);
});

// POST /api/minions
// create a new minion and save it to the database
minionsRouter.post('/', (req, res, next) => {
	try {
		// req.body is the new minion data sent by the client.
		const newMinion = addToDatabase('minions', req.body);
		if (!newMinion) {
			// Bad input shape or validation failure should return 400.
			return res.status(400).send();
		}
		// 201 means a new resource was created successfully.
		return res.status(201).send(newMinion);
	} catch (error) {
		// addToDatabase can throw if schema rules are violated.
		return res.status(400).send();
	}
});

// GET /api/minions/:minionId
// get a single minion by id
minionsRouter.get('/:minionId', (req, res, next) => {
	// Route params are always strings, which matches db id format.
	const minion = getFromDatabaseById('minions', req.params.minionId);
	if (!minion) {
		// If no minion exists for this id, return "not found".
		return res.status(404).send();
	}
	return res.send(minion);
});

// PUT /api/minions/:minionId
// update a single minion by id and save it to the database
minionsRouter.put('/:minionId', (req, res, next) => {
	// First make sure the target record exists before attempting an update.
	const existingMinion = getFromDatabaseById('minions', req.params.minionId);
	if (!existingMinion) {
		return res.status(404).send();
	}

	try {
		// Force the id to come from the URL, not from client-provided body data.
		const updateData = { ...req.body, id: req.params.minionId };
		const updatedMinion = updateInstanceInDatabase('minions', updateData);
		if (!updatedMinion) {
			// Existing id but invalid update payload.
			return res.status(400).send();
		}
		return res.send(updatedMinion);
	} catch (error) {
		// updateInstanceInDatabase can throw on invalid schema values.
		return res.status(400).send();
	}
});

// DELETE /api/minions/:minionId
// delete a single minion by id
minionsRouter.delete('/:minionId', (req, res, next) => {
	const deletedMinion = deleteFromDatabasebyId('minions', req.params.minionId);
	if (!deletedMinion) {
		return res.status(404).send();
	}
	// 204 means success with no response body.
	return res.status(204).send();
});

// BONUS: /api/minions/:minionId/work routes
// GET /api/minions/:minionId/work
// get all work for the specified minion
minionsRouter.get('/:minionId/work', (req, res, next) => {
	const minionId = req.params.minionId;
	// Validate parent minion before returning nested work items.
	const minion = getFromDatabaseById('minions', minionId);
	if (!minion) {
		return res.status(404).send();
	}

	// Work items are stored in one collection, so filter by minionId.
	const allWork = getAllFromDatabase('work');
	const minionWork = allWork.filter((work) => work.minionId === minionId);
	return res.send(minionWork);
});

// POST /api/minions/:minionId/work
// create and save a new work item for the specified minion
minionsRouter.post('/:minionId/work', (req, res, next) => {
	// You cannot create work for a minion that does not exist.
	const minion = getFromDatabaseById('minions', req.params.minionId);
	if (!minion) {
		return res.status(404).send();
	}

	try {
		// Override body minionId so URL owns the parent-child relationship.
		const newWork = { ...req.body, minionId: req.params.minionId };
		const addedWork = addToDatabase('work', newWork);
		if (!addedWork) {
			return res.status(400).send();
		}
		return res.status(201).send(addedWork);
	} catch (error) {
		return res.status(400).send();
	}
});

// PUT /api/minions/:minionId/work/:workId
// update a single work item by id
minionsRouter.put('/:minionId/work/:workId', (req, res, next) => {
	// Validate the parent minion first.
	const minion = getFromDatabaseById('minions', req.params.minionId);
	if (!minion) {
		return res.status(404).send();
	}

	// Validate the specific work item exists.
	const existingWork = getFromDatabaseById('work', req.params.workId);
	if (!existingWork) {
		return res.status(404).send();
	}

	// Reject mismatched parent-child updates (wrong minion path for this work id).
	if (existingWork.minionId !== req.params.minionId) {
		return res.status(400).send();
	}

	// Also reject if client body tries to switch ownership to another minion.
	if (req.body.minionId && String(req.body.minionId) !== req.params.minionId) {
		return res.status(400).send();
	}

	try {
		const updateData = {
			...req.body,
			id: req.params.workId,
			minionId: req.params.minionId,
		};
		const updatedWork = updateInstanceInDatabase('work', updateData);
		if (!updatedWork) {
			return res.status(400).send();
		}
		// Return the stored, updated work object.
		return res.status(200).send(updatedWork);
	} catch (error) {
		return res.status(400).send();
	}
});

// DELETE /api/minions/:minionId/work/:workId
// delete a single work item by id
minionsRouter.delete('/:minionId/work/:workId', (req, res, next) => {
	// Validate parent minion.
	const minion = getFromDatabaseById('minions', req.params.minionId);
	if (!minion) {
		return res.status(404).send();
	}

	// Validate child work item.
	const existingWork = getFromDatabaseById('work', req.params.workId);
	if (!existingWork) {
		return res.status(404).send();
	}

	// Ensure this work item belongs to the minion in the URL.
	if (existingWork.minionId !== req.params.minionId) {
		return res.status(400).send();
	}

	const deletedWork = deleteFromDatabasebyId('work', req.params.workId);
	if (!deletedWork) {
		return res.status(404).send();
	}
	// Deletion succeeded; no response body needed.
	return res.status(204).send();
});

module.exports = minionsRouter;
