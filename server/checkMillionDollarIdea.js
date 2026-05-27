// custom middleware function that will come in handy in some /api/ideas routes
// this function will make sure that any new or updated ideas are still worht at least one million dollars
const checkMillionDollarIdea = (req, res, next) => {
    // the total value of an idea is the product of its numWeeks and weeklyRevenue properties
    // if the total value of an idea is equal to or greater than 1 million, then the idea is worth pursuing!
    // if the total value of an idea is less than 1 million, then the idea is not worth pursuing!
    if(req.body.numWeeks * req.body.weeklyRevenue >= 1000000) {
        return next(); 
    } else {
        res.status(400).send('This idea is not worth pursuing!');
    }
};

// Leave this exports assignment so that the function can be used elsewhere
module.exports = checkMillionDollarIdea;
