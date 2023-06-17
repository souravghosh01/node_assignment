const mongoose = require('mongoose');

const roleSchema = new mongoose.Schema({
    id: {
        type: String,
    },
    name: {
        type: String,
        required: true,
    },
    scopes: [{
        type: String,
    }],
}, { timestamps: true });

roleSchema.pre("validate", function (next) {
    const role = this;
    if (role.isNew) {
        if (role.name === "Community Admin") {
            role.scopes = ["member-get", "member-add", "member-remove"];
        } else if (role.name === "Community Moderator") {
            role.scopes = ["member-get", "member-remove"];
        } else if (role.name === "Community Member") {
            role.scopes = ["member-get"];
        }
    }
    next();
});


module.exports = mongoose.model('role', roleSchema);