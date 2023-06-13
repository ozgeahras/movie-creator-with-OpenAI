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
    const { outline } = JSON.parse(body);

    const botReply = await fetchBotReply(outline);
    const synopsis = await fetchSynopsis(outline);
    const title = await fetchTitle(synopsis);
    const stars = await fetchStars(synopsis);
    const imagePrompt = await fetchImagePrompt(title, synopsis);
    const imageUrl = await fetchImageUrl(imagePrompt);

    const response = {
      statusCode: 200,
      body: JSON.stringify({
        botReply,
        synopsis,
        title,
        stars,
        imageUrl,
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

async function fetchBotReply(outline) {
  const response = await openai.createCompletion({
    model: "text-davinci-003",
    prompt: `Generate a short message to enthusiastically say an outline sounds interesting and that you need some minutes to think about it.
    ###
    outline: Two dogs fall in love and move to Hawaii to learn to surf.
    message: I'll need to think about that. But your idea is amazing! I love the bit about Hawaii!
    ###
    outline:A plane crashes in the jungle and the passengers have to walk 1000km to safety.
    message: I'll spend a few moments considering that. But I love your idea!! A disaster movie in the jungle!
    ###
    outline: A group of corrupt lawyers try to send an innocent woman to jail.
    message: Wow that is awesome! Corrupt lawyers, huh? Give me a few moments to think!
    ###
    outline: ${outline}
    message: 
    `,
    max_tokens: 60,
  });
  return response.data.choices[0].text.trim();
}

async function fetchSynopsis(outline) {
  const response = await openai.createCompletion({
    model: "text-davinci-003",
    prompt: `Generate an engaging, professional and marketable movie synopsis based on an outline. The synopsis should include actors names in brackets after each character. Choose actors that would be ideal for this role. 
    ###
    outline: A big-headed daredevil fighter pilot goes back to school only to be sent on a deadly mission.
    synopsis: The Top Gun Naval Fighter Weapons School is where the best of the best train to refine their elite flying skills. When hotshot fighter pilot Maverick (Tom Cruise) is sent to the school, his reckless attitude and cocky demeanor put him at odds with the other pilots, especially the cool and collected Iceman (Val Kilmer). But Maverick isn't only competing to be the top fighter pilot, he's also fighting for the attention of his beautiful flight instructor, Charlotte Blackwood (Kelly McGillis). Maverick gradually earns the respect of his instructors and peers - and also the love of Charlotte, but struggles to balance his personal and professional life. As the pilots prepare for a mission against a foreign enemy, Maverick must confront his own demons and overcome the tragedies rooted deep in his past to become the best fighter pilot and return from the mission triumphant.  
    ###
    outline: ${outline}
    synopsis: 
    `,
    max_tokens: 700,
  });
  return response.data.choices[0].text.trim();
}

async function fetchTitle(synopsis) {
  const response = await openai.createCompletion({
    model: "text-davinci-003",
    prompt: `Generate a catchy movie title for this synopsis: ${synopsis}`,
    max_tokens: 25,
    temperature: 0.7,
  });
  return response.data.choices[0].text.trim();
}

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

async function fetchImagePrompt(title, synopsis) {
  const response = await openai.createCompletion({
    model: "text-davinci-003",
    prompt: `Give a short description of an image which could be used to advertise a movie based on a title and synopsis. The description should be rich in visual detail but contain no names.
    ###
    title: Love's Time Warp
    synopsis: When scientist and time traveller Wendy (Emma Watson) is sent back to the 1920s to assassinate a future dictator, she never expected to fall in love with them. As Wendy infiltrates the dictator's inner circle, she soon finds herself torn between her mission and her growing feelings for the leader (Brie Larson). With the help of a mysterious stranger from the future (Josh Brolin), Wendy must decide whether to carry out her mission or follow her heart. But the choices she makes in the 1920s will have far-reaching consequences that reverberate through the ages.
    image description: A silhouetted figure stands in the shadows of a 1920s speakeasy, her face turned away from the camera. In the background, two people are dancing in the dim light, one wearing a flapper-style dress and the other wearing a dapper suit. A semi-transparent image of war is super-imposed over the scene.
    ###
    title: zero Earth
    synopsis: When bodyguard Kob (Daniel Radcliffe) is recruited by the United Nations to save planet Earth from the sinister Simm (John Malkovich), an alien lord with a plan to take over the world, he reluctantly accepts the challenge. With the help of his loyal sidekick, a brave and resourceful hamster named Gizmo (Gaten Matarazzo), Kob embarks on a perilous mission to stop Simm and save humanity from destruction. Along the way, he encounters alien technology, battles henchmen, and discovers his own hidden powers.
    image description: 
    ###
    title: ${title}
    synopsis: ${synopsis}
    image description: 
    `,
    max_tokens: 100,
  });
  return response.data.choices[0].text.trim();
}

async function fetchImageUrl(imagePrompt) {
  const response = await openai.createCompletion({
    model: "text-davinci-003",
    prompt: `Suggest a URL to an image that matches the given description.
    ###
    image description: A silhouetted figure stands in the shadows of a 1920s speakeasy, her face turned away from the camera. In the background, two people are dancing in the dim light, one wearing a flapper-style dress and the other wearing a dapper suit. A semi-transparent image of war is super-imposed over the scene.
    url: https://www.example.com/images/1920s_speakeasy.jpg
    ###
    image description: ${imagePrompt}
    url: 
    `,
    max_tokens: 20,
  });
  return response.data.choices[0].text.trim();
}
