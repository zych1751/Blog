import { Schema as _Schema, model } from 'mongoose';
import { hashSync, compareSync } from 'bcryptjs';

const Schema = _Schema;

const Account = new Schema({
    username: { type: String, required: true },
    password: { type: String, required: true },
    admin: { type: Boolean, default: false },
    created: { type: Date, default: Date.now },
});

Account.methods.generateHash = function(password) {
    return hashSync(password, 8);
};

Account.methods.validateHash = function(password) {
    return compareSync(password, this.password);
};

export default model('Account', Account);
