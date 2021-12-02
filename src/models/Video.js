
import mongoose from "mongoose";

const { Schema } = mongoose;

const schema = new Schema({
    title: { type: String, required: true, trim: true, minlength: 5, maxlength: 50 },
    description: { type: String, required: true, trim: true, minlength: 5, maxlength: 100 },
    createdAt: { type: Date, default: Date.now, required: true },
    hashtags: [ { type: String, trim: true } ],
    meta: {
        views: { type: Number, default: 0, required: true },
        comments: { type: Number, default: 0, required: true }
    }
});

const Video = mongoose.model('Video', schema);

export default Video;
