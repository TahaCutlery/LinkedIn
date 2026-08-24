import express from "express";
import cors from 'cors';
import dotenv from 'dotenv';
import DBConnect from "./utils/mongoDB_connect.js";
import userRoutes from "./routes/user.route.js";
import postRoutes from "./routes/post.route.js";
dotenv.config();

const app = express();
const port = process.env.PORT || 8000;
DBConnect();

app.use(cors());
app.use(express.json());
app.use(express.static("media/profile_PDF"));
app.use(express.static("media/profile_pictures"));
app.use(express.static("media/posts"));
app.use(userRoutes);
app.use(postRoutes);


app.listen(port, () => {
    console.log("Server listening on port:", port);
})