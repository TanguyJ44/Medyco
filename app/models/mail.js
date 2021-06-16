const nodemailer = require("nodemailer");

// Configurer le serveur email
var transport = nodemailer.createTransport({
    host: "ssl0.ovh.net",
    port: 587,
    secure: false,
    auth: {
        user: "contact@medyco.fr",
        pass: "!MedycoContact44"
    }
});

// Envoyer un email
let sendMail = (mailOptions) => {
    transport.sendMail(mailOptions, (error, info) => {
        if (error) {
            console.log(error);
        }
    });
};

module.exports = sendMail;