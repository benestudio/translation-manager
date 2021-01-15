import mongoose from "mongoose";

const schema = mongoose.Schema({
    code: String,
    name: String,
});

export default mongoose.model("Languages", schema);
