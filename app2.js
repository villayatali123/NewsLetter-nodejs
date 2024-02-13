const nodemailer = require("nodemailer");
const { google } = require("googleapis");
const config = require("./config/googleConfig");
const OAuth2 = google.auth.OAuth2;

const OAuth2_client = new OAuth2(config.clientId, config.clientSecret);

OAuth2_client.setCredentials({ refresh_token: config.refreshToken });

const accessToken = OAuth2_client.getAccessToken();
// Configure nodemailer
const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    type: "OAuth2",
    user: 'villayat56@gmail.com',
    clientId: config.clientId,
    clientSecret: config.clientSecret,
    refreshToken: config.refreshToken,
    accessToken: accessToken,
  },
});

const sendEmail = async  (email) => {
  const mailOptions = {
    from: "villayat56@gmail.com",
    to: email,
    subject: "Weekly Newsletter",
    html: `
            <h1>Welcome to Our Weekly Newsletter!</h1>
            <p>Here are the latest updates from our company:</p>
            <ul>
                <li>New feature launched!</li>
                <li>Upcoming events</li>
                <li>Latest blog posts</li>
            </ul>
            <p>Stay tuned for more exciting news!</p>
        `,
  };

  await transporter.sendMail(mailOptions);
  console.log(`Email sent to ${email}`);
}

sendEmail("villizain6@gmail.com")
console.log("hello");

