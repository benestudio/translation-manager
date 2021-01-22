import { readFileSync } from "fs";
import rimraf from "rimraf";
import extractReactIntlMessages from "extract-react-intl-messages";
import axios from "axios";
import dotenv from "dotenv";

dotenv.config();

const locales = ["en"];
const input = "src/**/!(*.test).js"
const buildDir = "messages";

const execModule = async () => {
    await extractReactIntlMessages(
        locales,
        input,
        buildDir,
    );
    const messages = JSON.parse(readFileSync(buildDir + "/en.json", "utf8"));
    rimraf(buildDir, () => {});
    console.log(`Found ${Object.keys(messages).length} defined messages, preparing to register them...`)
    const apiURL = process.env.API_URL
    const result = await axios.post(`${apiURL}register-messages`, { messages });
    if (result.data.success) {
        console.log("Successfully registered!")
    }
};

execModule();