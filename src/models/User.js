
import mongoose from "mongoose";
import bcrypt from "bcrypt";

const { Schema } = mongoose;


const schema = new Schema({
    name: { type: String, minlength: 2, maxlength: 50, required: true, unique: true },
    email: { type: String, minlength: 6, maxlength: 50, required: true, unique: true },
    password: { type: String, minlength: 8, maxlength: 20, required: true },
    userName: { type: String, minlength: 2, maxlength: 14, required: true },
    location: { type: String }
});

schema.pre('save', async function() {
    console.log('plain string : ', this.password); // test2222
    const hashedStr = await bcrypt.hash(this.password, 5);
    this.password = hashedStr;
    console.log('hashed string : ', this.password); // $2b$05$IfPSXHNjRZ51.oYnU8/cRO/Z5TwvSExmKpgS4QauRKbhB2f3mw9kW
});


const User = mongoose.model('User', schema);

export default User;
