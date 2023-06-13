const openai = require("../openaiConfig.js");

exports.handler = async (event) => {
  try {
    const { imagePrompt } = JSON.parse(event.body);

    const response = await openai.call("images", "create", {
      prompt: `${imagePrompt}. There should be no text in this image.`,
      n: 1,
      size: "256x256",
      response_format: "b64_json",
    });

    const imageUrl = `data:image/png;base64,${response.data.data[0].b64_json}`;

    const body = {
      imageUrl,
    };

    return {
      statusCode: 200,
      body: JSON.stringify(body),
    };
  } catch (error) {
    console.error(error);

    const response = {
      statusCode: 500,
      body: JSON.stringify({ error: "An error occurred" }),
    };

    return response;
  }
};
