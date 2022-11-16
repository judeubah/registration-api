const mongoose = require('mongoose');
const {Schema} = mongoose;

const category_schema = new Schema({
    stream: {
        type: String,
        required: true
    },
    sub_categories: [
        {
            name: {
                required: true,
                type: String
            },
            entries:{
                default:0,
                type: Number
            },
            time:{
                recent_entries: {
                    type: Array,
                    default:[]
                },
                time_between_entries:{
                    type: String,
                    default:""
                },
                day_dictionary:{
                    type: Object,
                    default:{monday:0,
                        tuesday:0,
                        wednesday:0,
                        thursday:0,
                        friday:0,
                        saturday:0,
                        sunday:0}
                },
                modal_day:{
                    type: String,
                    default:""
                },
                most_recent_entry:{
                    type: Number,
                    default: 0
                }
            }
        }
    ],
    average_time_between:{
        type: String,
        default: ""
    },
    entries:{
        type: Number,
        default:0
    },
    companies:{
        tally:{
            default: {},
            type: Object
        }, 
        modal_company:{
            default:"",
            type: String
        }
    }
    
}, {timestamps:true});

module.exports = mongoose.model('Category', category_schema);