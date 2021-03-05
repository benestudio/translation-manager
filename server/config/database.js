import mongoose from "mongoose";
const databasePath = "mongodb://localhost/translations";

mongoose.connect(databasePath, { useNewUrlParser: true, useUnifiedTopology: true, useFindAndModify: false })
    .then(() => {
        console.log("database connection successful");
    })
    .catch(err => console.error(err));
