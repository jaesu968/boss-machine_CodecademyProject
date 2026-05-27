const express = require('express');
const apiRouter = express.Router();

// routes go here

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
    const updatedMinion = updateInstanceInDatabase('minions', req.body);
    if (updatedMinion) {
      res.send(updatedMinion);
    } else {
      res.status(400).send();
    }
  });
  // DELETE /api/minions/:minionId
  // delete a single minion by id and remove it from the database
  apiRouter.delete('/minions/:minionId', (req, res, next) => {
    // there is a deleteFromDatabasebyId() function that you can use to delete a minion from the database
    const deletedMinion = deleteFromDatabasebyId('minions', req.params.minionId);
    if (deletedMinion) {
      res.send(deletedMinion);
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
  apiRouter.post('/ideas', (req, res, next) => {
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
    // use the updateInstanceInDatabase() function to update an idea in the database like above and send the updated idea back in the response
    // the instance must provide a valid .id property
    const updatedIdea = updateInstanceInDatabase('ideas', req.body);
    if (updatedIdea) {
      res.send(updatedIdea);
    } else {
      res.status(400).send();
    }
  }); 
  // DELETE /api/ideas/:ideaId
  // to delete a single idea by id 
  apiRouter.delete('/ideas/:ideaId', (req, res, next) => {
    // use the deleteFromDatabasebyId() function to delete an idea from the database like above and send the deleted idea back in the response
    const deletedIdea = deleteFromDatabasebyId('ideas', req.params.ideaId);
    if (deletedIdea) {
      res.send(deletedIdea);
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
    // use the addToDatabase() function to add a new meeting to the database like above and send the newly created meeting back in the response
    const newMeeting = addToDatabase('meetings', {});
    if (newMeeting) {
      res.status(201).send(newMeeting);
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


module.exports = apiRouter;
