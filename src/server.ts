import app from "./app";
import mongoose from "mongoose";
import config from "./app/config";
import { Server } from "http";

let server: Server;
const { port, database_url } = config;

const main = async () => {
    await mongoose.connect(database_url as string);
    server = app.listen(port, () => {
        console.log(`Server listening on http://localhost:${port}`);
    });
};
main().catch((err) => console.log(err));

process.on("unhandledRejection", () => {
    console.log("Unhandled Rejection is detected! Server is shutting down...!");
    if (server) {
        server.close(() => {
            process.exit(1);
        });
    }
    process.exit(1);
});

process.on("uncaughtException", () => {
    console.log("Uncaught Exception is detected! Server is shutting down...!");
    process.exit(1);
});
