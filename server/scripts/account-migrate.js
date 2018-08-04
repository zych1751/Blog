const mongoose = require('mongoose');
const db = mongoose.connection;

db.on('error', console.error);
db.once('open', () => {
    console.log('Connected to mongodb server');
});
mongoose.connect('mongodb://localhost/blog');

require('../models/account');

const Account = mongoose.model('Account');

Account.updateMany({
    "created": {"$lt": new Date(2018, 7, 24)}
},{
    confirmed: true
}, (err, numAffected, rawResponse) => {
    console.log("updated");
    process.exit(0);
});
