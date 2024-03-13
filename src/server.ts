import app from "./app";
import mongoose from "mongoose";
import config from "./app/config";

const { port, database_url } = config;

const main = async () => {
    await mongoose.connect(database_url as string);
    app.listen(port, () => {
        console.log(`Server listening on http://localhost:${port}`);
    });
};
main().catch((err) => console.log(err));
