const openai = require("../openaiConfig.js");

exports.handler = async (event) => {
  try {
    const { body } = event;
    const { synopsis } = JSON.parse(body);

    const imagePrompt = await fetchImagePrompt(synopsis);

    const response = {
      statusCode: 200,
      body: JSON.stringify({
        imagePrompt,
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

async function fetchImagePrompt(synopsis) {
  const response = await openai.createCompletion({
    model: "text-davinci-003",
    prompt: `Give a short description of an image which could be used to advertise a movie based synopsis. The description should be rich in visual detail but contain no names.
    ###
    title: Love's Time Warp
    synopsis: When scientist and time traveller Wendy (Emma Watson) is sent back to the 1920s to assassinate a future dictator, she never expected to fall in love with them. As Wendy infiltrates the dictator's inner circle, she soon finds herself torn between her mission and her growing feelings for the leader (Brie Larson). With the help of a mysterious stranger from the future (Josh Brolin), Wendy must decide whether to carry out her mission or follow her heart. But the choices she makes in the 1920s will have far-reaching consequences that reverberate through the ages.
    image description: A silhouetted figure stands in the shadows of a 1920s speakeasy, her face turned away from the camera. In the background, two people are dancing in the dim light, one wearing a flapper-style dress and the other wearing a dapper suit. A semi-transparent image of war is super-imposed over the scene.
    ###
    title: zero Earth
    synopsis: When bodyguard Kob (Daniel Radcliffe) is recruited by the United Nations to save planet Earth from the sinister Simm (John Malkovich), an alien lord with a plan to take over the world, he must travel to an alternate reality where the laws of physics are different. As Kob navigates this strange new world, he discovers his own hidden powers and forms an unlikely alliance with a renegade scientist (Natalie Portman). Together, they must stop Simm and save both Earths from destruction.
    image description: A futuristic cityscape stretches out before us, gleaming with neon lights and towering skyscrapers that seem to defy gravity. Flying cars zoom through the air, leaving colorful trails in their wake. In the distance, a massive portal crackles with energy, hinting at the alternate reality beyond.  
    ###
    synopsis: ${synopsis}
    image description: 
    `,
    max_tokens: 100,
  });
  return response.data.choices[0].text.trim();
}
