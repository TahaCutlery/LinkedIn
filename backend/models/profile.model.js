import { model, Schema } from "mongoose"

const educationSchema = new Schema({
    school: {
        type: String,
        default: ""
    },
    degree: {
        type: String,
        default: ""
    },
    field_of_study: {
        type: String,
        default: ""
    },
})

const workSchema = new Schema({
    company: {
        type: String,
        default: ""
    },
    position: {
        type: String,
        default: ""
    },
    years: {
        type: String,
        default: ""
    },
})

const profileSchema = new Schema({
    user_id: {
        type: Schema.Types.ObjectId,
        ref: "User"
    },
    bio: {
        type: String,
        default: ""
    },
    current_post: {
        type: String,
        default: ""
    },
    past_work: {
        type: [workSchema],
        default: []
    },
    education: {
        type: [educationSchema],
        default: []
    },
})

const Profile = model("Profile", profileSchema);
export default Profile;