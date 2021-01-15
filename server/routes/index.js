
import languages from "./languages.js";
import messages from "./messages.js";

export default (app) => {
    languages(app);
    messages(app);
}