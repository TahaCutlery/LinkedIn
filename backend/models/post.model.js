import { model, Schema } from "mongoose";

const postSchema = new Schema({
    user_id: {
        type: Schema.Types.ObjectId,
        ref: "User"
    },
    body: {
        type: String,
        required: true
    },
    likes: {
        type: [Schema.Types.ObjectId],
        ref: "User",
        default: []
    },
    createdAt: {
        type: Date,
        default: Date.now()
    },
    updatedAt: {
        type: Date,
        default: Date.now()
    },
    media: {
        type: String,
        default: ""
    },
    active: {
        type: Boolean,
        default: true
    },
    fileType: {
        type: String,
        default: ""
    }
})

const Post = model("Post", postSchema);
export default Post;