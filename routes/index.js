var express = require('express');
var router = express.Router();
const mongoose= require('mongoose');
var app = express();

app.use(function(req, res, next) {
  res.locals.isAuthenticated = req.isAuthenticated();
  res.locals.user = req.user;
  next();
});
/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('index', { title: 'Devrev' });
});

router.get('/about', function(req, res, next) {
  res.render('about', { title: 'Devrev' });
});

router.route('/contact')
  .get(function(req, res, next) {
    res.render('contact', { title: 'Devrev'});
  })
  .post(function(req, res, next) {
    req.checkBody('name', 'Empty name').notEmpty();
    req.checkBody('email', 'Invalid email').isEmail();
    req.checkBody('message', 'Empty message').notEmpty();
    var errors = req.validationErrors();

    if(errors) {
      res.render('contact', {
        title: 'Devrev',
        name: req.body.name,
        email: req.body.email,
        message: req.body.message,
        errorMessages: errors
      });
    }
    else{
      res.render('thanks', { title: 'Devrev'});
    }
  });

  router.route('/addcentre')
  .get(function(req, res, next) {
    res.render('addcentre', { title: 'Devrev'});
  })
  .post(function(req, res, next) {
    req.checkBody('name', 'Empty Name').notEmpty();
    req.checkBody('address', 'Empty Name').notEmpty();
    req.checkBody('workingHours', 'Empty Name').notEmpty();
    req.checkBody('availableDoses', 'Empty Name').notEmpty();

    
    var errors = req.validationErrors();
    if (errors) {
      console.log(errors);
      res.render('addcentre', {
      
        name: req.body.name,
        address: req.body.address,
        errorMessages: errors
      });
    } else {
  
      var VaccinationCenter = require('../models/Admintask');
    var newVaccinationCenter = new VaccinationCenter();
     newVaccinationCenter._id=new mongoose.Types.ObjectId();
      newVaccinationCenter.name=req.body.name;
      newVaccinationCenter.address=req.body.address;
      newVaccinationCenter.workingHours=req.body.workingHours;;
      newVaccinationCenter.availableDoses=req.body.availableDoses;
     
      newVaccinationCenter.save()
      .then((savedVaccinationCenter) => {
        console.log('Vaccination center saved:', savedVaccinationCenter);
        res.redirect('/thanks');
      })
      .catch((err) => {
        console.error('Error saving vaccination center:', err);
        res.render('addcentre', { errorMessages: err });
      });
    }
    
  });


  router.route('/book')
  .get( async (req, res) => {
    const query = req.query.query;
  let vaccinationCenters;

  if (query && typeof query === 'string') {
    vaccinationCenters = await VaccinationCenter.find().exec();
    vaccinationCenters = vaccinationCenters.filter(vaccinationCenter =>
      vaccinationCenter.address.includes(query)
    );
  } else {
    vaccinationCenters = await VaccinationCenter.find().exec();
  }

  res.render('book', {
    title: 'Book',
    vaccinationCenters: vaccinationCenters,
    user:req.user
  });
  })
  .post(async (req, res) => {
    const userId=req.user.id;
    const covidId = req.body.covidId;


    try {
     
      const user = await User.findById(userId);
      const vaccinationCenter = await VaccinationCenter.findById(covidId);
    
    
     
      if (user.bookedSlot) {
        return res.status(400).json({ error: 'You already have a booked slot' });
      }
      
      if (vaccinationCenter.availableDoses <= 0 || vaccinationCenter.availableDoses > 10) {
        // No available doses, show an error message or redirect
        return res.status(400).json({ error: 'No slots available' });
      }
  
      user.bookedSlot = covidId;
      await user.save();
  
     
      vaccinationCenter.availableDoses--;
      await vaccinationCenter.save();
  
     
      res.redirect('/sbooking');
    } catch (error) {
    
      console.log(error);
      res.status(500).json({ error: 'An error occurred during booking' });
    }
  });
 
  router.get('/search', async (req, res) => {
    const query = req.query.query;
  let vaccinationCenters;

  if (query && typeof query === 'string') {
    vaccinationCenters = await VaccinationCenter.find().exec();
    vaccinationCenters = vaccinationCenters.filter(vaccinationCenter =>
      vaccinationCenter.address.includes(query)
    );
  } else {
    vaccinationCenters = await VaccinationCenter.find().exec();
  }
  
    res.render('search', {
      title: 'Search',
      vaccinationCenters: vaccinationCenters,
    });
  });
   
  router.post('/delete', (req, res) => {
    const centreId = req.body.covidId;
  
    // Find the vaccination center by its ID
    VaccinationCenter.findOne({ _id: centreId })
      .then((vaccinationCenter) => {
        if (vaccinationCenter) {
          // If the vaccination center exists, remove it
          return VaccinationCenter.deleteOne({ _id: centreId });
        } else {
          res.sendStatus(404);
        }
      })
      .then(() => {
        // Deletion successful
        res.redirect('/search');
      })
      .catch((error) => {
        console.error('Error removing vaccination center:', error);
        res.sendStatus(500);
      });
  });

 router.get('/thanks', (req, res) => {
    res.render('thanks');
 });

module.exports = router;
