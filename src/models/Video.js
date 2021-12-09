
import mongoose from "mongoose";

const { Schema } = mongoose;

const schema = new Schema({
    title: { type: String, required: true, trim: true, minlength: 4, maxlength: 50 },
    description: { type: String, required: true, trim: true, minlength: 4, maxlength: 100 },
    createdAt: { type: Date, default: Date.now, required: true },
    hashtags: [ { type: String, trim: true } ],
    meta: {
        views: { type: Number, default: 0, required: true },
        comments: { type: Number, default: 0, required: true }
    },
    videoUrl: { type: String, required: true }
});

/*
schema.pre('save', async function(){
    this.hashtags = this.hashtags[0]
                    .split(',')
                    .map((item) => (item.startsWith('#') ? `${item}` : `#${item}`));
    console.log(this);
});
*/

schema.static('hashtagsFormat', function(hashtags) {
    const result = hashtags
                    .split(',')
                    .map((item) => (item.startsWith('#') ? `${item}` : `#${item}`));

    return result;
});

const Video = mongoose.model('Video', schema);

export default Video;
