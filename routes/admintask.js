var express = require('express');
var router = express.Router(); 

router.route('/createCentre')
.get(function(req, res, next) {
    res.render('admin', { title: 'Devrev'});
  })
.post(function(req, res, next) {
    const newVaccinationCenter = new VaccinationCenter({
        name: "My Vaccination Center",
        address: "123 Main Street",
        workingHours: "9am-5pm",
        dosageDetails: [{
          doseNumber: 1,
          availableDoses: 100,
        }, {
          doseNumber: 2,
          availableDoses: 50,
        }],
      });
      
      newVaccinationCenter.save((err) => {
        if (err) {
          console.log(err);
        } else {
          console.log("Vaccination center added successfully");
        }
      });
});



module.exports=router;