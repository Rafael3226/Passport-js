const mongoose = require('mongoose');

const Schema = mongoose.Schema;

const userSchema = new Schema({
    username:{ type: String, required: true, unique: true },
    token:{ type: String, required: true, unique: true },
    displayName:{ type: String, required: true, unique: false },
    email: {type: String, required: true, unique: true}
}, 
{
  timestamps: true,
});

const Users = mongoose.model('Users', userSchema);
module.exports = Users;
