import fs from "fs"; 
import imagekit from "../configs/imageKit.js";
import User from "../models/User.js";
import Story from "../models/Story.js";
import { inngest } from "../inngest/index.js";

// Add User Story
export const addUserStory = async (req, res) => {
    try {
        const { userId } = req.auth();
        const {content, media_type, background_color} = req.body;
        const media = req.file
        let media_url = ''

        // upload media to imageKit
        if(media_type === 'image' || media_type === 'video'){
            const fileBuffer = fs.readFileSync(media.path)
            const response = await imagekit.upload({
                file: fileBuffer,
                fileName: media.originalname,
            })
            media_url = response.url
        }
        // Create Story
        const story = await Story.create({
            user: userId,
            content,
            media_url,
            media_type,
            background_color
        })

        // Schedule story deletion after 24 hours
        await inngest.send({
            name: 'app/story.delete',
            data: { storyId: story._id }
        })

        res.json({success: true})

    } catch (error) {
        console.log(error);
        res.json({ success: false, message: error.message });
    }
}

// Get User Stories 
export const getStories = async (req, res) => {
    try {
        const { userId } = req.auth();
        const user = await User.findById(userId)

        // User connections and followers
        const userIds = [userId, ...user.connections, ...user.following]

        const stories = await Story

    } catch (error) {
        console.log(error);
        res.json({ success: false, message: error.message });
    }
}