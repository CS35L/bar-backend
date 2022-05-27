const nodemailer = require("nodemailer");

_transporter = null;

async function init() {
    let testAccount = await nodemailer.createTestAccount();

    // create reusable transporter object using the default SMTP transport
    /*
    {
        host: "smtp.gmail.com",
        port: 465,
        secure: true, // true for 465, false for other ports
        auth: {
            type: 'OAuth2',
            user: process.env.MAIL_USER,
            serviceClient: process.env.GMAIL_SERVICE_CLIENT,
            clientId: '743984005169-dsf10an7066vmfi39aka3dcaemjos19b.apps.googleusercontent.com' ,
            clientSecret: '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',
            privateKey: process.env.GMAIL_PRIVATE_KEY,
            refreshToken: process.env.GMAIL_REFRESH_TOKEN,
            accessToken: process.env.GMAIL_ACCESS_TOKEN,
            expires: Date.now(),
        },
    }
    */
    _transporter = nodemailer.createTransport({
        service: 'gmail',
        auth: {
            user: process.env.MAIL_USER,
            pass: process.env.MAIL_PASSWORD,
        }
    });
}

async function send(targetEmail, title, textContent, htmlContent) {
    if (!_transporter) await init();
    // send mail with defined transport object
    let info = await _transporter.sendMail({
        from: `"${title} 👻"`, // sender address
        to: targetEmail, // list of receivers
        subject: title, // Subject line
        text: textContent, // plain text body
        html: htmlContent, // html body
    });
    return info
}

module.exports = { send }