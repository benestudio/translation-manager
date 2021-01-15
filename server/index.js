import express from "express";
import http from "http";
import cors from "cors";
import bodyParser from "body-parser";
import "./config/database.js";
import routes from "./routes/index.js";

const app = express();
const server = http.Server(app);

// parse application/x-www-form-urlencoded
app.use(bodyParser.urlencoded({ extended: false }))

// parse application/json
app.use(bodyParser.json())

app.use(cors())

server.listen(process.env.PORT || 8080, err => {
    if (err) {
        console.error(err);
    } else {
        console.info("Listening at http://localhost:" + (process.env.PORT || 8080));
    }
});

routes(app);
