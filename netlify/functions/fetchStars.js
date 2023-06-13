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

    const stars = await fetchStars(synopsis);

    const response = {
      statusCode: 200,
      body: JSON.stringify({
        stars,
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

async function fetchStars(synopsis) {
  const response = await openai.createCompletion({
    model: "text-davinci-003",
    prompt: `Extract the names in brackets from the synopsis.
    ###
    synopsis: The Top Gun Naval Fighter Weapons School is where the best of the best train to refine their elite flying skills. When hotshot fighter pilot Maverick (Tom Cruise) is sent to the school, his reckless attitude and cocky demeanor put him at odds with the other pilots, especially the cool and collected Iceman (Val Kilmer). But Maverick isn't only competing to be the top fighter pilot, he's also fighting for the attention of his beautiful flight instructor, Charlotte Blackwood (Kelly McGillis). Maverick gradually earns the respect of his instructors and peers - and also the love of Charlotte, but struggles to balance his personal and professional life. As the pilots prepare for a mission against a foreign enemy, Maverick must confront his own demons and overcome the tragedies rooted deep in his past to become the best fighter pilot and return from the mission triumphant.
    names: Tom Cruise, Val Kilmer, Kelly McGillis
    ###
    synopsis: ${synopsis}
    names:   
    `,
    max_tokens: 30,
  });
  return response.data.choices[0].text.trim();
}
