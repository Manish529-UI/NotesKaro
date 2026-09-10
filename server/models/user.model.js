import mongoose from 'mongoose';
const userSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true
    },
    email: {
        type: String,
        required: true,
        unique: true
    },
    password: {
        type: String,
        // Not required — Google auth users won't have a password
    },
    credits: {
        type: Number,
        default: 50,
        min: 0
    },
    isCreditAvailable: {
        type: Boolean,
        default: true
    },
    notes: {
        type: [mongoose.Schema.Types.ObjectId],
        ref: "Notes",
        default: []
    }
},{timestamps: true});

const UserModel = mongoose.model('UserModel', userSchema);

export default UserModel;
