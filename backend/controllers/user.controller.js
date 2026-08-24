import bcrypt from 'bcrypt';
import User from '../models/user.model.js';
import Profile from '../models/profile.model.js';
import crypto from 'crypto';
import PDFDocument from 'pdfkit';
import fs from "fs";
import sharp from "sharp";
import ConnectionRequest from '../models/connection.model.js';
import { json } from 'stream/consumers';


const convertProfileDataToPDF = async (profile) => {
    return new Promise(async (resolve, reject) => {
        try {
            if (!fs.existsSync("media/profile_PDF")) {
                fs.mkdirSync("media/profile_PDF", { recursive: true });
            }
            const doc = new PDFDocument({ margin: 40, size: 'A4' });
            const outputPath = crypto.randomBytes(16).toString("hex") + ".pdf";
            const writeStream = fs.createWriteStream(`media/profile_PDF/${outputPath}`);

            doc.pipe(writeStream);

            // Top Liquid Gold Accent Header Banner
            doc.rect(0, 0, 595.28, 10).fill('#D4AF37');

            let currentY = 35;

            // Profile Picture
            const pictureFilename = profile?.user_id?.profilePicture;
            const imagePath = pictureFilename ? `media/profile_pictures/${pictureFilename}` : null;
            let imageProcessed = false;

            if (imagePath && fs.existsSync(imagePath)) {
                try {
                    const imageBuffer = await sharp(imagePath).toFormat('jpeg').toBuffer();
                    doc.image(imageBuffer, 465, currentY, { width: 85, height: 85 });
                    imageProcessed = true;
                } catch (imgErr) {
                    console.error("Error processing profile picture for PDF:", imgErr);
                }
            }

            // User Primary Details
            const userName = profile?.user_id?.name || 'Professional Name';
            const userHandle = profile?.user_id?.username ? `@${profile.user_id.username}` : '';
            const userEmail = profile?.user_id?.email || '';
            const currentPost = profile?.current_post || 'Professional';

            doc.font('Helvetica-Bold').fontSize(22).fillColor('#1E1914').text(userName, 40, currentY, { width: 400 });
            currentY = doc.y + 2;

            doc.font('Helvetica-Bold').fontSize(13).fillColor('#B8860B').text(currentPost, 40, currentY, { width: 400 });
            currentY = doc.y + 4;

            const contactLine = [userEmail, userHandle].filter(Boolean).join('  |  ');
            if (contactLine) {
                doc.font('Helvetica').fontSize(10).fillColor('#6B6152').text(contactLine, 40, currentY, { width: 400 });
                currentY = doc.y + 15;
            } else {
                currentY += 15;
            }

            if (imageProcessed && currentY < 130) {
                currentY = 135;
            }

            // Golden Divider Line
            doc.moveTo(40, currentY).lineTo(555, currentY).strokeColor('#D4AF37').lineWidth(1.5).stroke();
            currentY += 20;

            // Helper function for section headers
            const addSectionHeader = (title) => {
                doc.font('Helvetica-Bold').fontSize(12).fillColor('#8C6010').text(title.toUpperCase(), 40, currentY);
                currentY = doc.y + 3;
                doc.moveTo(40, currentY).lineTo(555, currentY).strokeColor('#F4E7C5').lineWidth(1).stroke();
                currentY += 10;
            };

            // Summary / Bio Section
            if (profile?.bio) {
                addSectionHeader('Executive Summary');
                doc.font('Helvetica').fontSize(10.5).fillColor('#332D25').text(profile.bio, 40, currentY, {
                    width: 515,
                    lineGap: 3
                });
                currentY = doc.y + 20;
            }

            // Past Work Experience Section
            if (profile?.past_work && profile.past_work.length > 0) {
                addSectionHeader('Work Experience');
                profile.past_work.forEach((work) => {
                    if (work.position) {
                        doc.font('Helvetica-Bold').fontSize(11).fillColor('#1E1914').text(work.position, 40, currentY, { width: 515 });
                        currentY = doc.y + 2;
                    }

                    const companyAndYears = [work.company, work.years].filter(Boolean).join('  •  ');
                    if (companyAndYears) {
                        doc.font('Helvetica-Bold').fontSize(9.5).fillColor('#B8860B').text(companyAndYears, 40, currentY, { width: 515 });
                        currentY = doc.y + 10;
                    } else {
                        currentY += 8;
                    }
                });
                currentY += 10;
            }

            // Education Section
            if (profile?.education && profile.education.length > 0) {
                addSectionHeader('Education');
                profile.education.forEach((edu) => {
                    if (edu.school) {
                        doc.font('Helvetica-Bold').fontSize(11).fillColor('#1E1914').text(edu.school, 40, currentY, { width: 515 });
                        currentY = doc.y + 2;
                    }

                    const degreeAndField = [edu.degree, edu.field_of_study].filter(Boolean).join(' in ');
                    if (degreeAndField) {
                        doc.font('Helvetica').fontSize(9.5).fillColor('#6B6152').text(degreeAndField, 40, currentY, { width: 515 });
                        currentY = doc.y + 10;
                    } else {
                        currentY += 8;
                    }
                });
                currentY += 10;
            }

            // Footer
            doc.moveTo(40, 780).lineTo(555, 780).strokeColor('#E7DED0').lineWidth(0.75).stroke();
            doc.font('Helvetica').fontSize(9).fillColor('#9C9180').text(
                `LinkedIn Executive Resume  •  Generated on ${new Date().toLocaleDateString()}`,
                40,
                790,
                { align: 'center', width: 515 }
            );

            doc.end();

            writeStream.on("finish", () => {
                resolve(outputPath);
            });

            writeStream.on("error", (err) => {
                reject(err);
            });

        } catch (err) {
            reject(err);
        }
    });
}

export const register = async (req, res) => {
    try {
        const { name, username, email, password } = req.body;

        if (!name || !username || !email || !password) {
            return res.status(400).json({ message: "All fields are required!" });
        }

        const user = await User.findOne({ email });
        if (user) {
            return res.status(400).json({ message: "User already exists!" });
        }

        const hashPassword = await bcrypt.hash(password, 12);

        const newUser = new User({
            name,
            username,
            password: hashPassword,
            email,
        });
        await newUser.save();

        const profile = new Profile({ user_id: newUser.id });
        await profile.save();

        res.status(201).json({ message: "User created successfully!", user: newUser })
    } catch (err) {
        console.log(err);
        return res.status(500).json({ message: "Internal server error", error: err.message });
    }
}

export const login = async (req, res) => {
    try {
        const { email, password } = req.body;

        if (!email || !password) {
            return res.status(400).json({ message: "All fields are required!" });
        }
        const existUser = await User.findOne({ email });
        if (!existUser) {
            return res.status(404).json({ message: "User not found!" });
        }
        const passwordCheck = await bcrypt.compare(password, existUser.password);
        if (!passwordCheck) {
            return res.status(401).json({ message: "Invalid password!" });
        }

        const token = crypto.randomBytes(32).toString("hex");
        existUser.token = token;
        await existUser.save();

        return res.status(200).json({ message: "User logged in successfully!", token });

    } catch (err) {
        console.log(err);
        return res.status(500).json({ message: "Internal server error", error: err.message });
    }
}

export const updateProfilePicture = async (req, res) => {
    try {
        const { token } = req.body;
        const user = await User.findOne({ token });
        if (!user) {
            return res.status(404).json({ message: "User not found" });
        }

        user.profilePicture = req.file.filename;
        await user.save();

        return res.status(200).json({ message: "Profile updated successfully" });

    } catch (err) {
        return res.status(500).json({ message: "Internal server error", error: err.message });
    }
}

export const updateUser = async (req, res) => {
    try {
        const { token, ...newUserData } = req.body;

        const user = await User.findOne({ token });
        const { username, email } = newUserData;
        const existingUser = await User.findOne({ $or: [{ username }, { email }] });

        if (existingUser && String(user._id) !== String(existingUser._id)) {
            return res.status(400).json({ message: "User already exist!" });
        }

        Object.assign(user, newUserData);
        await user.save();

        return res.status(200).json({ message: "User updated successfully", user });
    } catch (err) {
        return res.status(500).json({ message: "Internal server error", error: err.message });
    }
}

export const getUserAndProfile = async (req, res) => {
    try {
        const { token } = req.query;
        const user = await User.findOne({ token });
        if (!user) {
            return res.status(404).json({ message: "User not found" });
        }
        const profile = await Profile.findOne({ user_id: user._id });
        if (!profile) {
            return res.status(404).json({ message: "Profile not found" });
        }
        return res.status(200).json({ message: "User and profile fetched successfully", user, profile });
    } catch (err) {
        return res.status(500).json({ message: "Internal server error", error: err.message });
    }
};

export const updateUserProfile = async (req, res) => {
    try {
        const { token, ...newProfileData } = req.body;

        const user = await User.findOne({ token });
        if (!user) {
            return res.status(404).json({ message: "User not found" });
        }

        const profile = await Profile.findOne({ user_id: user._id });
        if (!profile) {
            return res.status(404).json({ message: "Profile not found" });
        }

        Object.assign(profile, newProfileData);
        await profile.save();

        return res.status(200).json({ message: "Profile updated successfully", profile });
    } catch (err) {
        return res.status(500).json({ message: "Internal server error", error: err.message });
    }
}

export const getAllUsersProfile = async (req, res) => {
    try {
        const profiles = await Profile.find().populate("user_id", "username email name profilePicture");
        if (!profiles) {
            return res.status(404).json({ message: "Users not found" });
        }
        return res.status(200).json({ message: "Users fetched successfully", profiles });
    } catch (err) {
        return res.status(500).json({ message: "Internal server error", error: err.message });
    }
}

export const downloadProfile = async (req, res) => {
    try {
        const user_id = req.query.id;
        const profile = await Profile.findOne({ user_id })
            .populate("user_id", "name username email profilePicture");
        if (!profile) {
            return res.status(404).json({ message: "Profile not found" });
        }

        const outputPath = await convertProfileDataToPDF(profile);

        return res.status(200).json({ message: "Profile convert successfully", outputPath });
    } catch (err) {
        return res.status(404).json({ message: "Internal server error", error: err.message });
    }
}

export const sendConnectionRequest = async (req, res) => {
    try {
        const { token, connection_id } = req.body;
        const user = await User.findOne({ token });
        if (!user) {
            return res.status(404).json({ message: "User not found" });
        }
        const connectionUser = await User.findById(connection_id);
        if (!connectionUser) {
            return res.status(404).json({ message: "Connection user not found" });
        }
        const existingConnection = await ConnectionRequest.findOne({
            user_id: user._id,
            connection_id
        });

        if (existingConnection) {
            return res.status(400).json({ message: "Connection request already exists" });
        }
        const connection = new ConnectionRequest({
            user_id: user._id,
            connection_id
        });
        await connection.save();
        return res.status(200).json({ message: "Connection request sent successfully" });
    } catch (err) {
        return res.status(500).json({ message: "Internal server error", error: err.message });
    }
}

export const followers = async (req, res) => {
    try {
        const { token } = req.query;
        const user = await User.findOne({ token });
        if (!user) {
            return res.status(404).json({ message: "User not found" });
        }
        const followers = await ConnectionRequest.find({ connection_id: user._id }).populate("user_id", "name username email profilePicture");

        return res.status(200).json({ message: "Followers fetched successfully", followers });

    } catch (err) {
        return res.status(500).json({ message: "Internal server error", error: err.message });
    }
}

export const followings = async (req, res) => {
    try {
        const { token } = req.query;
        const user = await User.findOne({ token });
        if (!user) {
            return res.status(404).json({ message: "User not found" });
        }
        const followings = await ConnectionRequest.find({ user_id: user._id }).populate("connection_id", "name username email profilePicture");

        return res.status(200).json({ message: "Followings fetched successfully", followings });

    } catch (err) {
        return res.status(500).json({ message: "Internal server error", error: err.message });
    }
}

export const acceptConnection = async (req, res) => {
    try {
        const { token, connection_id } = req.body;
        const user = await User.findOne({ token });
        if (!user) {
            return res.status(404).json({ message: "User not found" });
        }
        const connection = await ConnectionRequest.findById(connection_id);
        if (!connection) {
            return res.status(404).json({ message: "Connection not found" });
        }
        connection.status_accepted = true;
        await connection.save();

        return res.status(200).json({ message: `Connection accepted successfully` });
    } catch (err) {
        return res.status(500).json({ message: "Internal server error", error: err.message });
    }
}

export const rejectConnectionRequest = async (req, res) => {
    try {
        const { token, connection_id } = req.body;
        const user = await User.findOne({ token });
        if (!user) {
            return res.status(404).json({ message: "User not found" });
        }
        const connectionRequest = await ConnectionRequest.findById(connection_id);
        if (!connectionRequest) {
            return res.status(404).json({ message: "Connection request not found" });
        }
        await ConnectionRequest.deleteOne({ _id: connection_id });
        return res.status(200).json({ message: "Connection request deleted successfully" });
    } catch (err) {
        return res.status(500).json({ message: "Internal server error", error: err.message });
    }   
}

export const getUserAndProfileBasedOnUsername = async (req, res) => {
    try {
        const {username} = req.query;
        const user = await User.findOne({ username: username });
        if (!user) {
            return res.status(404).json({ message: "User not found" });
        }
        const profile = await Profile.findOne({ user_id: user._id }).populate("user_id", "name username email profilePicture");
        if (!profile) {
            return res.status(404).json({ message: "Profile not found" });
        }
        return res.status(200).json({ message: "User and profile fetched successfully", profile });
    } catch (err) {
        return res.status(500).json({ message: "Internal server error", error: err.message });
    }
}