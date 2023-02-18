const mongoose = require('mongoose')
const { ObjectId } = mongoose.Schema.Types

const userSchema = new mongoose.Schema({
    firstName: {
        type: String,
        required: true
    },
    lastName: {
        type: String,
        required: true
    },
    email: {
        type: String,
        required: true
    },
    password: {
        type: String,
        required: true
    },
    birthday: {
        type: String,
        required: true
    },
    photo: {
        type: String,
        default: "https://www.pngkey.com/png/detail/157-1579943_no-profile-picture-round.png"
    },
    followers: [{
        type: ObjectId,
        ref: "User"
    }],
    following: [{
        type: ObjectId,
        ref: "User"
    }],
    kind: {
        type: String,
        default: "common"
    }
})

mongoose.model("User", userSchema)