const mongoose = require('mongoose');
const Schema   = mongoose.Schema;

const asanaSchema = new Schema ({

    title: String,
    description: String,

})


const Asana = mongoose.model('Asana', asanaSchema);



module.exports = Asana;