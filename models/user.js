const mongoose = require('mongoose');
const bcrypt = require('bcrypt-nodejs');
const Schema = mongoose.Schema;

// the user schema attributes / characteristics / fields
const UserSchema = new Schema({
    email: { type: String, unique: true, lowercase: true },
    password: String,
    profile: {
        name: { type: String, default: '' },
        picture: { type: String, default: '' }
    },
    address: String,
    history: [{
        date: Date,
        paid: { type: Number, default: 0 },
        item: { type: Schema.Types.ObjectId, ref: '' }
    }]
});

// hash the password before saving it to the database
/*UserSchema.pre('save', function(next) {
    const user = this;
    if(!user.isModified('password')) return next();
    bcrypt.genSalt(10, (err, salt) => {
        if(err) return next(err);
        bcrypt.hash(user.password, salt, null, (err, hash) => {
            if(err) return next(err);
            user.password = hash;
            next();
        });
    });
});*/

UserSchema.pre('save', function(next) {
    // a new pw generated by the hash and saved for third user
    //$2a$10$k3vKZyzdZlBoe3ovO6CsKuUkcbWfkNixiw9MVURgnhcDamPrjXfBC
    const user = this;
    bcrypt.genSalt(10, (err, salt) => {
        if(err) return next(err);
        bcrypt.hash(user.password, salt, null, (err, hash) => {
            if(err) return next(err);
            user.password = hash;
            next();
        });
    });
    next();
});

// compare password in the database and the one user types in
UserSchema.methods.comparePw = function(password) {
    return bcrypt.compareSync(password, this.password);
}

module.exports = mongoose.model('User', UserSchema);