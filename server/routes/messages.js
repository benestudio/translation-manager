import Messages from "../config/models/messages.js";
import Languages from "../config/models/languages.js";
import fs from "fs";
import path from "path";

export default (app) => {
    app.get("/messages", async (req, res) => {
        const results = await Messages.find({});
        res.json(results);
    });

    app.post("/message", async (req, res) => {
        const { key, defaultMessage, messages, description, screenshot, widget } = req.body;
        await Messages.insertMany([{ key, defaultMessage, messages, description, screenshot, widget }]);
        res.end();
    });

    app.delete("/message/:_id", async (req, res) => {
        const { _id } = req.params;
        await Messages.deleteOne({ _id });
        res.end();
    });

    app.put("/message/:_id", async (req, res) => {
        const { _id } = req.params;
        const { key, defaultMessage, messages, description, screenshot, widget } = req.body;
        await Messages.updateOne({ _id }, {
            $set: {
                defaultMessage,
                messages,
                key,
                description,
                screenshot,
                widget,
            },
        });
        res.end();
    });

    app.put("/refresh-messages", async (req, res) => {
        await refreshMessages();
        res.end();
    })

    app.post("/register-messages", async (req, res) => {
        const { messages } = req.body;
        for (let [key, defaultMessage] of Object.entries(messages)) {
            await Messages.update({ key }, {
                key,
                defaultMessage,
            }, { upsert: true });
        }
        res.end();
    })
}

const refreshMessages = async () => {
    const messageTokens = await Messages.find({});
    const languages = (await Languages.find({})).map(language => language.code);
    const messages = {};
    languages.forEach(lang => {
        messages[lang] = {};
    });
    messageTokens.forEach(messageToken => {
        languages.forEach(lang => {
            let message = messageToken.messages[lang] || messageToken.defaultMessage;
            messages[lang][messageToken.key] = message;
        });
    });

    for (let language of languages) {
        fs.writeFileSync(
            path.resolve(`./public/messages/${language}.json`),
            JSON.stringify(messages[language])
        );
    }

};

setTimeout(refreshMessages, 2000);