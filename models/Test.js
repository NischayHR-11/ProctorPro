const mongoose = require("mongoose");

const TestSchema = new mongoose.Schema({

    name: {
        type: String,
        required: true,
    },
    skills: {
        type: String,
        required: true,
    },
    type: {
        type: String,
        required: true,
    },
    owner: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "user",
    },
    questions: [
        {
            title: {
                type: String,
                required: true,
            },
            level:{
                type:String,
                default:"Easy",
            },
            options: [
                {
                    type: String,
                    required: true,
                },
            ],
            answer:Number,
        }
    ],
    time:Number,

});

module.exports = mongoose.model("Test", TestSchema);
