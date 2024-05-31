const mongoose = require('mongoose');

const packageSchema = new mongoose.Schema({
    packageName: {
        type: String,
        required: true,
    },
    packagePrice: {
        type: Number,
        required: true,
    },
    features: [{
        type: String,
        required: true,
    }]

})

let Packages = new mongoose.model('Packages', packageSchema);
module.exports = Packages;