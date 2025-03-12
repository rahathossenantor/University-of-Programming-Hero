import app from "./app";
import mongoose from "mongoose";
import config from "./app/config";
import { Server } from "http";
import seedSuperAdmin from "./app/db/seedSuperAdmin";

let server: Server;
const { port, database_url } = config;

const main = async () => {
    await mongoose.connect(database_url as string);
    await seedSuperAdmin();

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

/*

NODE_ENV=development
PORT=5000
DATABASE_URL=mongodb+srv://university-of-programming-hero:lJaWTYAb3iDJCsig@junior.tpsklbw.mongodb.net/university?retryWrites=true&w=majority&appName=Junior
DEFAULT_PASSWORD=12345
BCRYPT_SALT_ROUNDS=12
JWT_ACCESS_SECRET=20e88d228f596cec04308140cf54db057551601667822de57fb99d97dbbe6757df9ec4ebf452fc7008152eaf8be5a873a4faa
090af83692479fb03ff8f1342c7
JWT_REFRESH_SECRET=2b799815ca64f1b2f3af1969e846baa1f13d48eb35f38cd17f25b8db5355957b7c07b491efa1a3bf195cbd9963d3101da6f0c
95a31405f6ff2f56fbe9d19e1cf
JWT_ACCESS_EXPIRES_IN=1d
JWT_REFRESH_EXPIRES_IN=360d
RESET_PASSWORD_URL=http://localhost:3000
SMTP_USER=md.rahathossenantor@gmail.com
SMTP_PASS=xsop wppo hqlb atmb
CLOUDINARY_CLOUD_NAME=dboonmy3k
CLOUDINARY_API_KEY=278449434777944
CLOUDINARY_API_SECRET=3_-Ob-wAbdhTNMuL1_h65SMVmuY

*/
