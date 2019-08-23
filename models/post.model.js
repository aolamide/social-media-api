import mongoose from "mongoose";
const {ObjectId} = mongoose.Schema;

const postSchema = new mongoose.Schema({
    title : {
        type : String,
        required : true
    },
    body : {
        type : String,
        required : true
    },
    photo : {
        type : Buffer,
        contentType: String
    },
    postedBy : {
        type: ObjectId,
        ref: "User"
    },
    created : {
        type: Date,
        default: Date.now
    }
});
const postModel = mongoose.model('Post', postSchema);

export default postModel;