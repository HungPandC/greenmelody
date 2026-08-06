import mongoose from "mongoose";

const UserSchema = new mongoose.Schema({
    username:{
        type: String,
        required: true,
        unique: true,
        trim: true,
        lowercase: true
    },
    hashedPassword:{
        type: String,
    },
    email:{
        type: String,
        required: true,
        unique: true,
        trim: true,
        lowercase: true
    },
    displayName:{
        type: String,
        //required: true,
        trim: true,
    },
    // avatarUrl:{
    //     type: String // link anh
    // },
    // avatarID:{
    //     type: String // public id de xoa anh
    // },
    // bio:{
    //     type: String,
    //     maxlength:350,
    // },
    phone:{
        type:String,
        sparse: true, // dc null
    },
    emailOTP: {
        type: String
    },
    emailOTPExpires: {
        type: Date
    },
    isVerified: {
        type: Boolean,
        default: false
    },
    coin: {
        type: Number,
        default: 0
    },
    gem: {
        type: Number,
        default: 0
    },
    currentStreak: {
        type: Number,
        default: 0
    },
    lastStreakDate: {
        type: Date,
        default: null
    },
    longestStreak: {
        type: Number,
        default: 0
    },
    googleId: {
        type: String,
        default: null
    },

    avatar: {
        type: String,
        default: null
    },
    },
    {
        timestamps:true,
    }
);
const User = mongoose.model("User",UserSchema)
export default User;