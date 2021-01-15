import Languages from "../config/models/languages.js";

export default (app) => {
    app.get("/languages", async (req, res) => {
        const results = await Languages.find({});
        res.json(results);
    });

    app.post("/language", async (req, res) => {
        const { code, name } = req.body;
        await Languages.insertMany([{ code, name }]);
        res.end();
    });

    app.delete("/language/:code", async (req, res) => {
        const { code } = req.params;
        await Languages.deleteOne({ code });
        res.end();
    });

    app.put("/language/:code", async (req, res) => {
        const { code } = req.params;
        const { name } = req.body;
        await Languages.updateOne({ code }, {
            $set: {
                name,
            },
        });
        res.end();
    })
}
