const express = require('express');
const apiRouter = express.Router();

// routes go here

// /api/minions routes 
// GET /api/minions 
apiRouter.get('/minions', (req, res, next) => {
    // get an array of all minions in the database
    // there is a getAllFromDatabase() function that you can use to get all minions
    const minions = getAllFromDatabase('minions');
    res.send(minions);
  });   



module.exports = apiRouter;
