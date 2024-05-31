const mongoose = require('mongoose');

const filesSchema = new mongoose.Schema({
    category: {
        type: String,
        required: true,
    },
    pupil_id: {
        type: Number,
        required: true,
    },
    uploadFile: {
        type: String,
        required: true,
    },
    userName: {
        type: String,
        required: true,
    },
    fileExtension: {
        type: String,
        required: true,
    }

})
 let Files = new mongoose.model('Files', filesSchema);
 module.exports = Files;