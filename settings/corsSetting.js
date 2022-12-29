const whitelist = ["http://localhost:3500", "http://127.0.0.1:5500", "https://www.google.com"];

const hasAccess = (req) => whitelist.indexOf(req.header("Origin")) !== -1;

const corsSettings = (req, callback) => callback(null, { origin: hasAccess(req) });

module.exports = corsSettings;
