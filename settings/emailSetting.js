const gmailSetting = {
  service: "gmail",
  auth: {
    user: "youremail@gmail.com",
    pass: "yourpassword",
  },
};

const mailOptionsWithText = (from, to, subject, text) => {
  return {
    from,
    to,
    subject,
    text,
  };
};

const mailOptionsWithHtml = (from, to = [], subject, html) => {
  return {
    from,
    to: to.join(","),
    subject,
    html,
  };
};

module.exports = { gmailSetting, mailOptionsWithText, mailOptionsWithHtml };
