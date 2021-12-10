
import mongoose from "mongoose";
import bcrypt from "bcrypt";


const { Schema } = mongoose;


const schema = new Schema({
    name: { type: String, minlength: 2, maxlength: 50, required: true, unique: true },
    email: { type: String, minlength: 6, maxlength: 50, required: true, unique: true },
    password: { type: String, maxlength: 20 },
    userName: { type: String, minlength: 2, maxlength: 14, required: true },
    location: { type: String },
    snsOnly: { type: Boolean, default: false },
    avatarUrl: { type: String },
    videos: [
        { type: mongoose.Schema.Types.ObjectId, ref: 'Video' }
    ]
});

schema.pre('save', async function() {
    const isModified = this.isModified('password');
    if(isModified) {
        const hashedStr = await bcrypt.hash(this.password, 5);
        this.password = hashedStr;
    }
});


const User = mongoose.model('User', schema);

export default User;
