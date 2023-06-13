const { Configuration, OpenAIApi } = require("openai");

const apiKey = process.env.VITE_MOVIE_APP_API_KEY;

const configuration = new Configuration({
  organization: "org-8sBBKnnzpa0m1QQdIgYJtvhS",
  apiKey: apiKey,
});
delete configuration.baseOptions.headers["User-Agent"];
const openai = new OpenAIApi(configuration);

exports.handler = async (event) => {
  try {
    const { body } = event;
    const { synopsis } = JSON.parse(body);

    const title = await fetchTitle(synopsis);

    const response = {
      statusCode: 200,
      body: JSON.stringify({
        title,
      }),
    };

    return response;
  } catch (error) {
    console.error(error);

    const response = {
      statusCode: 500,
      body: JSON.stringify({ error: "An error occurred" }),
    };

    return response;
  }
};

async function fetchTitle(synopsis) {
  const response = await openai.createCompletion({
    model: "text-davinci-003",
    prompt: `Generate a catchy movie title for this synopsis: ${synopsis}`,
    max_tokens: 25,
    temperature: 0.7,
  });
  return response.data.choices[0].text.trim();
}
