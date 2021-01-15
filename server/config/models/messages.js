import mongoose from "mongoose";

const schema = mongoose.Schema({
    key: String,
    defaultMessage: String,
    widget: String,
    description: String,
    screenshot: String,
    messages: mongoose.Schema.Types.Mixed,
});

export default mongoose.model("Messages", schema);
