const sendNewsLetterEmail = async (email) => {
    console.log("im in sendEmail fn ===> ", email);
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
  };
  const sendSubscribeEmail = async (email) => {
    console.log("im in sendEmail fn ===> ", email);
    const mailOptions = {
      from: "villayat56@gmail.com",
      to: email,
      subject: "Weekly Newsletter Subscription",
      html: `<p>Subscribe to our newsletter: <a href="http://localhost:3000/api/v1/subscribe?email=${email}
        ">Subscribe</a></p>`,
    };
    await transporter.sendMail(mailOptions);
    console.log(`Email sent to ${email}`);
  };
  
  module.exports = {
    sendNewsLetterEmail,
    sendSubscribeEmail,
  };
  