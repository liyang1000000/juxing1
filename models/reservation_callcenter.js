// grab the things we need
var mongoose = require('mongoose');
var Schema = mongoose.Schema;


var reserveCallCenterSchema = new Schema({
    created: {
        type: Date,
        default: Date.now
    },
    // resv_time: {
    //   type: String,
    //   default: ""
    // },
    resv_time: {
        type: String
    },
    resv_time_abs: Number,
    name: {
        type: String,
        lowercase: true
    },
    tel: {
        type: String,
        default: ""
    },
    party_size: {
        type: Number,
        default: 1
    },
    start_time: {
        type: Number,
        default: 14
    },
    duration: {
        type: Number,
        default: 1
    }, //how long they want to stay
    status: {
        type: Number,
        default: 1 //1 is pending, 2 is confirmed, 0 is canceled
    },
    room: {
        type: Number,
        default: 0 //0 is in the lobby, other numbers are for each room.
    },
    note: {
        type: String,
        default: "Put your note here"
    },
    UID: String,
    showed_up: {
        type: Boolean,
        default: false
    },
    active: {
        type: Boolean,
        default: true
    },
    contacted: {
        type: Number,
        default: 0 //0 for not called yet, 1 for confirmed, 2 for now answer
    },
    room_size: {
        type: Number,
        default: 0 //0 is not signed yet, 1 for small, 2 for medium, 3 for large
    },
    room_price: {
        type: String,
        default: '99.99'
    },
    message_sent: {
        type: Boolean,
        default: false
    },
    resv_uuid: {
        type: String,
        default: ''
    },
    card_name: {
        type: String,
        default: ''
    },
    card_number: {
        type: String,
        default: ''
    },
    card_cvv: {
        type: String,
        default: ''
    },
    card_expired: {
        type: String,
        default: ''
    },
    resv_legacy_id: {
        type: String,
        default: ''
    }
});

// the schema is useless so far
// we need to create a model using i
const callCenterDB = mongoose.connection.useDb('juxing');
var ResvCallCenter = callCenterDB.model('Reservation', reserveCallCenterSchema);

// make this available to our users in our Node applications
module.exports = ResvCallCenter;
