const userSchema = {
    username: {
        type: String,
        required: true,
        unique: true,
    },
};

export default userSchema;
