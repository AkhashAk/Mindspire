const mongoose = require("mongoose");

const userSchema = mongoose.Schema(
    {
        name: {
            type: String,
            required: true
        },
        emailID: {
            type: String,
            required: true,
            unique: true
        },
        password: {
            type: String,
            required: true
        },
        refreshToken: [String],
    }, {
    timestamps: true
    },
    { versionKey: false }
);

const User = mongoose.model("User", userSchema);
module.exports = User;