import { model, Schema } from "mongoose";

const commentSchema = new Schema({
    user_id: {
        type: Schema.Types.ObjectId,
        ref: "User"
    },
    post_id: {
        type: Schema.Types.ObjectId,
        ref: "Post"
    },
    body: {
        type: String,
        required: true
    }
})

const Comment = model("Comment", commentSchema);
export default Comment;