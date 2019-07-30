const mongoose = require('mongoose');
const Schema   = mongoose.Schema;

const asanaSchema = new Schema ({

    sanskrit_name: String,
    english_name: String,
    img_url: String,

})


const Asana = mongoose.model('Asana', asanaSchema);



module.exports = Asana;