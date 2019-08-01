const mongoose = require('mongoose');
const Schema   = mongoose.Schema;

const qandaSchema = new Schema ({

    question: String,
    answer: String,

})


const QandA = mongoose.model('QandA', qandaSchema);



module.exports = QandA;