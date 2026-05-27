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


module.exports = apiRouter;
