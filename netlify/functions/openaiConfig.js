const { Configuration, OpenAIApi } = require("openai");

const apiKey = process.env.VITE_MOVIE_APP_API_KEY;

const configuration = new Configuration({
  organization: "org-8sBBKnnzpa0m1QQdIgYJtvhS",
  apiKey: apiKey,
});
delete configuration.baseOptions.headers["User-Agent"];
const openai = new OpenAIApi(configuration);

module.exports = openai;
