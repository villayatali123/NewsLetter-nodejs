const nodemailer = require("nodemailer");
const { google } = require("googleapis");
const config = require("../config/googleConfig");
const OAuth2 = google.auth.OAuth2;

const OAuth2_client = new OAuth2(config.clientId, config.clientSecret);

OAuth2_client.setCredentials({ refresh_token: config.refreshToken });

const accessToken = OAuth2_client.getAccessToken();
// Configure nodemailer
const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    type: "OAuth2",
    user: process.env.gmail,
    clientId: config.clientId,
    clientSecret: config.clientSecret,
    refreshToken: config.refreshToken,
    accessToken: accessToken,
  },
});

module.exports ={
  transporter,
}
