const setupInputContainer = document.getElementById("setup-input-container");
const movieBossText = document.getElementById("movie-boss-text");

document.getElementById("send-btn").addEventListener("click", () => {
  const setupTextarea = document.getElementById("setup-textarea");
  if (setupTextarea.value) {
    const userInput = setupTextarea.value;
    setupInputContainer.innerHTML = `<img src="/loading.svg" class="loading" id="loading">`;
    movieBossText.innerText = `Ok, just wait a second while my digital brain digests that...`;
    fetchBotReply(userInput);
    fetchSynopsis(userInput);
  }
});

async function fetchBotReply(outline) {
  const response = await fetch("/.netlify/functions/fetchOpenAi", {
    method: "POST",
    body: JSON.stringify({ outline }),
    headers: { "Content-Type": "application/json" },
  });
  const data = await response.json();
  const botReply = data.text.trim();
  movieBossText.innerText = botReply;
}

async function fetchSynopsis(outline) {
  const response = await fetch("/.netlify/functions/fetchOpenAi", {
    method: "POST",
    body: JSON.stringify({ outline }),
    headers: { "Content-Type": "application/json" },
  });
  const data = await response.json();
  const synopsis = data.text.trim();
  document.getElementById("output-text").innerText = synopsis;
  fetchTitle(synopsis);
  fetchStars(synopsis);
}

async function fetchTitle(synopsis) {
  const response = await fetch("/.netlify/functions/fetchOpenAi", {
    method: "POST",
    body: JSON.stringify({ synopsis }),
    headers: { "Content-Type": "application/json" },
  });
  const data = await response.json();
  const title = data.text.trim();
  document.getElementById("output-title").innerText = title;
  fetchImagePrompt(title, synopsis);
}

async function fetchStars(synopsis) {
  const response = await fetch("/.netlify/functions/fetchOpenAi", {
    method: "POST",
    body: JSON.stringify({ synopsis }),
    headers: { "Content-Type": "application/json" },
  });
  const data = await response.json();
  document.getElementById("output-stars").innerText = data.text.trim();
}

async function fetchImagePrompt(title, synopsis) {
  const response = await fetch("/.netlify/functions/fetchOpenAi", {
    method: "POST",
    body: JSON.stringify({ title, synopsis }),
    headers: { "Content-Type": "application/json" },
  });
  const data = await response.json();
  fetchImageUrl(data.text.trim());
}

async function fetchImageUrl(imagePrompt) {
  const response = await fetch("/.netlify/functions/fetchOpenAi", {
    method: "POST",
    body: JSON.stringify({ imagePrompt }),
    headers: { "Content-Type": "application/json" },
  });
  const data = await response.json();
  document.getElementById(
    "output-img-container"
  ).innerHTML = `<img src="${data.imageUrl}">`;
  setupInputContainer.innerHTML = `<button id="view-pitch-btn" class="view-pitch-btn">View Pitch</button>`;
  document.getElementById("view-pitch-btn").addEventListener("click", () => {
    document.getElementById("setup-container").style.display = "none";
    document.getElementById("output-container").style.display = "flex";
    movieBossText.innerText = `This idea is so good I'm jealous! It's gonna make you rich for sure! Remember, I want 10% 💰`;
  });
}
