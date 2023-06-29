const mongoose = require("mongoose");

const vaccinationCenterSchema = new mongoose.Schema({
  name: String,
  address: String,
  workingHours: String,
  availableDoses:{
    type: Number,
    default: 10
  },
  _id: { type: mongoose.Types.ObjectId, auto: true }
});

vaccinationCenterSchema.index({ id: 1 }, { unique: true });

module.exports = mongoose.model('VaccinationCenter', vaccinationCenterSchema);
