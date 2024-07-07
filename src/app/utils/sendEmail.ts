import nodemailer from "nodemailer";
import config from "../config";

const sendEmail = async (email: string, resetLink: string) => {
    const transporter = nodemailer.createTransport({
        host: "smtp.gmail.com",
        port: 587,
        secure: config.node_env === "production",
        auth: {
            user: "md.rahathossenantor@gmail.com",
            pass: "xsop wppo hqlb atmb"
        }
    });

    await transporter.sendMail({
        from: "md.rahathossenantor@gmail.com",
        to: email,
        subject: "Reset your password",
        text: "",
        html: `<b>Did you forget your password? Don't worry! Here is your reset link: ${resetLink}</b>`
    });
};

export default sendEmail;
