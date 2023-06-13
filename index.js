async function fetchBotReply(outline) {
  const response = await fetch("/.netlify/functions/fetchOpenAi", {
    method: "POST",
    body: JSON.stringify({ outline }),
    headers: { "Content-Type": "application/json" },
  });
  const data = await response.json();
  return data.botReply;
}

async function fetchSynopsis(outline) {
  const response = await fetch("/.netlify/functions/fetchOpenAi", {
    method: "POST",
    body: JSON.stringify({ outline }),
    headers: { "Content-Type": "application/json" },
  });
  const data = await response.json();
  return data.synopsis;
}

async function fetchTitle(synopsis) {
  const response = await fetch("/.netlify/functions/fetchOpenAi", {
    method: "POST",
    body: JSON.stringify({ synopsis }),
    headers: { "Content-Type": "application/json" },
  });
  const data = await response.json();
  return data.title;
}

async function fetchStars(synopsis) {
  const response = await fetch("/.netlify/functions/fetchOpenAi", {
    method: "POST",
    body: JSON.stringify({ synopsis }),
    headers: { "Content-Type": "application/json" },
  });
  const data = await response.json();
  return data.stars;
}

async function fetchImagePrompt(title, synopsis) {
  const response = await fetch("/.netlify/functions/fetchOpenAi", {
    method: "POST",
    body: JSON.stringify({ title, synopsis }),
    headers: { "Content-Type": "application/json" },
  });
  const data = await response.json();
  return data.imagePrompt;
}

async function fetchImageUrl(imagePrompt) {
  const response = await fetch("/.netlify/functions/fetchOpenAi", {
    method: "POST",
    body: JSON.stringify({ imagePrompt }),
    headers: { "Content-Type": "application/json" },
  });
  const data = await response.json();
  return data.imageUrl;
}
