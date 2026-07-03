const mongoose = require('mongoose');
const PrayerLetterSchema = new mongoose.Schema({
    title: { type: String, required: true },
    fileUrl: { type: String, required: true },
    uploadDate: { type: Date, default: Date.now }
});
module.exports = mongoose.model('PrayerLetter', PrayerLetterSchema);