const { Schema, default: mongoose } = require("mongoose");
const { hashText, verifyHashed } = require("../utils/bcrypt");

const userSchema = new Schema({
    name: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true, select: false }
}, { timestamps: true });

userSchema.pre('save', async function (next) {
    if(!this.isModified('password'))
        return next();
    this.password = await hashText(this.password);
    next();
});

userSchema.methods.comparePassword = async function (candidatePassword) {
    return verifyHashed(candidatePassword, this.password);
}

module.exports = mongoose.model('Users', userSchema);