import { model, Schema } from "mongoose";

const connectionSchecma = new Schema({
    user_id: {
        type: Schema.Types.ObjectId,
        ref: "User"
    },
    connection_id: {
        type: Schema.Types.ObjectId,
        ref: "User"
    },
    status_accepted: {
        type: Boolean,
        default: false
    }
})

const ConnectionRequest = model("ConnectionRequest", connectionSchecma);
export default ConnectionRequest;