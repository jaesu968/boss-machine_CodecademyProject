const express = require('express');
const apiRouter = express.Router();
// import db functions from db.js
const { 
  getAllFromDatabase,
  getFromDatabaseById,
  addToDatabase,
  updateInstanceInDatabase,
  deleteFromDatabasebyId,
  deleteAllFromDatabase,
  createMeeting
} = require('./db.js');
// import middleware from /server/checkMillionDollarIdea.js
const checkMillionDollarIdea = require('./checkMillionDollarIdea.js');

// routes will go here

// /api/minions routes 
// GET /api/minions 
// get an array of all minions in the database
apiRouter.get('/minions', (req, res, next) => {
    // there is a getAllFromDatabase() function that you can use to get all minions
    const minions = getAllFromDatabase('minions');
    res.send(minions);
  });   
// POST /api/minions 
// create a new minion and save it to the database 
apiRouter.post('/minions', (req, res, next) => {
    // there is an addToDatabase() function that you can use to add a new minion to the database
    const newMinion = addToDatabase('minions', req.body);
    if (newMinion) {
      res.status(201).send(newMinion);
    } else {
      res.status(400).send();
    }
  });
// GET /api/minions/:minionId
// get a single minion by id 
apiRouter.get('/minions/:minionId', (req, res, next) => {
    // there is a getFromDatabaseById() function that you can use to get a single minion by id
    const minion = getFromDatabaseById('minions', req.params.minionId);
    if (minion) {
      res.send(minion);
    } else {
      res.status(404).send();
    }
  });
  // PUT /api/minions/:minionId
  // update a single minion by id and save the updated minion to the database
  apiRouter.put('/minions/:minionId', (req, res, next) => {
    // there is an updateInstanceInDatabase() function that you can use to update a minion in the database
    // the instance must provide a valid .id property
    const updatedMinion = updateInstanceInDatabase('minions', req.body); // check whether the target minion exists using getFromDatabaseById() before updating
    // if not found, send a 404 status code 
    if (updatedMinion) {
      res.send(updatedMinion);
    } else {
      res.status(404).send();
      // force the update payload id to match the route param
      updateData = { ...req.body, id: req.params.minionId };
      // if update returns null or throws a validation error, return a 400 status code
        if (updateInstanceInDatabase('minions', updateData) === null) {
            res.status(400).send();
        } else {
            // return the updated object 
            res.send(updateInstanceInDatabase('minions', updateData));
        }
    }
  });
  // DELETE /api/minions/:minionId
  // delete a single minion by id and remove it from the database
  apiRouter.delete('/minions/:minionId', (req, res, next) => {
    // there is a deleteFromDatabasebyId() function that you can use to delete a minion from the database
    const deletedMinion = deleteFromDatabasebyId('minions', req.params.minionId);
    if (deletedMinion) {
      res.status(204).send(deletedMinion);
    } else {
      res.status(404).send();
    }
  }); 

  // /api/ideas routes 
  // where you can use CRUD operations to manage ideas in the database

  // GET /api/ideas
  // to get an array of all ideas in the database
  apiRouter.get('/ideas', (req, res, next) => {
    // use the getAllFromDatabase() function to get all ideas from the database like above and send them back in the response
    const ideas = getAllFromDatabase('ideas');
    res.send(ideas);
  }); 
  // POST /api/ideas 
  // to create a new idea and save it to the database
  apiRouter.post('/ideas', checkMillionDollarIdea, (req, res, next) => {
    // use the addToDatabase() function to add a new idea to the database like above and send the newly created idea back in the response
    const newIdea = addToDatabase('ideas', req.body);
    if (newIdea) {
      res.status(201).send(newIdea);
    } else {
      res.status(400).send();
    }   
  }); 
  // GET /api/ideas/:ideaId
  // to get a single idea by id
  apiRouter.get('/ideas/:ideaId', (req, res, next) => {
    // use the getFromDatabaseById() function to get a single idea by id like above and send it back in the response
    const idea = getFromDatabaseById('ideas', req.params.ideaId);
    if (idea) {
      res.send(idea);
    } else {
      res.status(404).send();
    }
  }); 
// PUT /api/ideas/:ideaId
// to update a single idea by id
apiRouter.put('/ideas/:ideaId', (req, res, next) => {
    // get the existing idea from the database using getFromDatabaseById() and check if it exists before updating
    const existingIdea = getFromDatabaseById('ideas', req.params.ideaId);
    if (!existingIdea) {
        return res.status(404).send(); // if it doesn't exist, send a 404 response. 
    }
    // call checkMillionDollarIdea() middleware function to validate the updated idea before updating in the database
    checkMillionDollarIdea(req, res, () => {
    const updateData = { ...req.body, id: req.params.ideaId }; // force the update payload id to match the route param
    // use try catch to update the idea in the database using updateInstanceInDatabase() function and handle any validation errors that may be thrown
    try {
        const updatedIdea = updateInstanceInDatabase('ideas', updateData); 
        if (!updatedIdea){
            return res.status(400).send(); // if updateInstanceInDatabase() returns null, send a 400 status code
        }
        return res.status(200).send(updatedIdea); // return the updated object if successful
        } catch (error) {
    return res.status(400).send(); // if updateInstanceInDatabase() throws a validation error, return a 400 status code
    }
    });
}); 

  // DELETE /api/ideas/:ideaId
  // to delete a single idea by id 
  apiRouter.delete('/ideas/:ideaId', (req, res, next) => {
    // use the deleteFromDatabasebyId() function to delete an idea from the database like above and send the deleted idea back in the response
    const deletedIdea = deleteFromDatabasebyId('ideas', req.params.ideaId);
    if (deletedIdea) {
      res.status(204).send(deletedIdea);
    } else {
      res.status(404).send();
    }
  });

  // routes for meetings 
  // /api/meetings where you can use CRUD operations to manage meetings in the database

  // GET /api/meetings 
  // to get an array of all meetings in the database
  apiRouter.get('/meetings', (req, res, next) => {
    // use the getAllFromDatabase() function to get all meetings from the database like above and send them back in the response
    const meetings = getAllFromDatabase('meetings');
    res.send(meetings);
  }); 
  // POST /api/meetings
  // to create a new meeting and save it to the database
  // no request body is necessary as meetings are automatically created by the server upon request. 
  apiRouter.post('/meetings', (req, res, next) => {
    // use createMeeting() function to create a new meeting and add it to the database, then send the newly created meeting back in the response
    const newMeeting = createMeeting();
    // then persist with addToDatabase() function
    const addedMeeting = addToDatabase('meetings', newMeeting);
    if (addedMeeting) {
      res.status(201).send(addedMeeting); // return 201 with saved meeting object if successful
    } else {
      res.status(400).send();
    }
  }); 
// DELETE /api/meetings 
// to delete all meetings from the database
apiRouter.delete('/meetings', (req, res, next) => {
    // use the deleteAllFromDatabase() function to delete all meetings from the database and send a success status code with no response body
    deleteAllFromDatabase('meetings');
    res.status(204).send();
  });

  // BONUS: 

  // Get /api/minions/:minionId/work
  // To get an array of all work for the specified minion 
  apiRouter.get('/minions/:minionId/work', (req, res, next) => {
    // return a 404 status code if minion id is non-numeric or nonexistent
    const minionId = req.params.minionId; // read minionId from the route params
    const minion = getFromDatabaseById('minions', minionId);
    if (!minion) {
        return res.status(404).send();
    }
    // use the getAllFromDatabase() function to get all work from the database, then filter the work to include only those with the correct minionId and send the filtered array back in the response
    const allWork = getAllFromDatabase('work');
    const minionWork = allWork.filter(work => work.minionId === minionId);
    res.send(minionWork);
  }); 

  // POST /api/minions/:minionId/work
  // To create a new work object and save it to the database
  apiRouter.post('/minions/:minionId/work', (req, res, next) => {
    // use the addToDatabase() function to add a new work object to the database like above and send the newly created work object back in the response
    // make sure to set the minionId of the new work object to match the :minionId route parameter
    const newWork = { ...req.body, minionId: req.params.minionId };
    const addedWork = addToDatabase('work', newWork); // if addToDatabase() returns null, send a 400 status code, otherwise return the newly created work object with a 201 status code
    if (addedWork) {
      res.status(201).send(addedWork);
    } else {
      res.status(400).send();
    }
  }); 
  // PUT /api/minions/:minionId/work/:workId
  // To update a single work by id and save it to the database
    apiRouter.put('/minions/:minionId/work/:workId', (req, res, next) => {
    // get the existing work from the database using getFromDatabaseById() and check
    const existingWork = getFromDatabaseById('work', req.params.workId);
    if (!existingWork) {
        return res.status(404).send(); // if it doesn't exist, send a 404 response. This is a "not found" error
    }
    // check if the minion exists by req.params.minionId and return 404 if not 
    const minion = getFromDatabaseById('minions', req.params.minionId);
    if (!minion) {
        return res.status(404).send();
    }
    // check that the work belongs to the minion by req.params.minionId and return 400 if not
    if (existingWork.minionId !== req.params.minionId) {
        return res.status(400).send();
    }
    // call checkMillionDollarIdea() middleware function to validate the updated work before updating in the database
    // use try catch to update the work in the database using updateInstanceInDatabase() function and handle any validation errors that may be thrown
    try {
        const updateData = { ...req.body, id: req.params.workId, minionId: req.params.minionId }; // force the update payload id to match the route param and ensure the minionId also matches the route param
        const updatedWork = updateInstanceInDatabase('work', updateData); 
        if (!updatedWork){
            return res.status(400).send(); // if updateInstanceInDatabase() returns null, send a 400 status code. This is a "bad request" error
        }
        return res.status(200).send(updatedWork); // return the updated object if successful
        } catch (error) {
    return res.status(400).send(); // if updateInstanceInDatabase() throws a validation error, return a 400 status code. This is also a "bad request" error
    }
}); 
// DELETE /api/minions/:minionId/work/:workId
// To delete a single work by id and remove it from the database
apiRouter.delete('/minions/:minionId/work/:workId', (req, res, next) => {
    // use the deleteFromDatabasebyId() function to delete a single work from the database like above and send a success status code with no response body if successful, or a 404 status code if the work with the provided id was not found in the database
    const deletedWork = deleteFromDatabasebyId('work', req.params.workId);
    if (deletedWork) {
      res.status(204).send();
    } else {
      res.status(404).send();
    }
});


module.exports = apiRouter;
