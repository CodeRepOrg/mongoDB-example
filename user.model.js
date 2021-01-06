const mongoose =require('mongoose');

const model = new mongoose.Schema ({
    name: String
})

module.exports = mongoose.model('model', model);