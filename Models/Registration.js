const mongoose = require('mongoose');
const {Schema} = mongoose;

const registration_schema = new Schema({
    full_name: {
        type: String,
        required: true
    },
    email: {
        type:String,
        required: true
    },
    job: {
        type:String,
        required: true
    },
    company: {
        type:String,
        required: true
    },
    phone:  {
        type:Number,
        required: true
    },
    chosen_categories: {
        type:Array,
        required: true
    },
}, {timestamps:true});

module.exports = mongoose.model('register', registration_schema)