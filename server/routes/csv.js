import Messages from "../config/models/messages.js";
import { convertToCSV, parseCSV } from "../util/csv.js";


export default (app) => {
    app.get("/csv", async (req, res) => {
        const messages = await Messages.find({});
        const messageRows = messages.map(message => ({
            key: message.key,
            ...message.messages
        }))
        console.log(messageRows)
        const csv = await convertToCSV(messageRows)
        res.writeHead(200, {
            'Content-Type': 'application/octet-stream',
            'Content-disposition': 'attachment; filename=messages.csv'
        });
        res.write(csv);
        res.end();
    });

    app.post("/csv", async (req, res) => {
        const { data } = req.body;
        const messageRows = await parseCSV(data)
        const rowUpdates = messageRows.map(async (messageRow) => {
            const { key, ...messages } = messageRow
            return await Messages.findOneAndUpdate({ key }, { messages }, {
                upsert: true,
            })
        })
        await Promise.all(rowUpdates)
        res.end();
    });
}
