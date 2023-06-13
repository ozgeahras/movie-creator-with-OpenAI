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
  const response = await fetch("/.netlify/functions/fetchBotReply", {
    method: "POST",
    body: JSON.stringify({ outline }),
    headers: { "Content-Type": "application/json" },
  });
  const data = await response.json();
  movieBossText.innerText = data.botReply.trim();
}

async function fetchSynopsis(outline) {
  const response = await fetch("/.netlify/functions/fetchSynopsis", {
    method: "POST",
    body: JSON.stringify({ outline }),
    headers: { "Content-Type": "application/json" },
  });
  const data = await response.json();
  console.log(data);
  const synopsis = data.synopsis.trim();

  document.getElementById("output-text").innerText = synopsis;
  fetchTitle(synopsis);
  fetchStars(synopsis);
}

async function fetchTitle(synopsis) {
  const response = await fetch("/.netlify/functions/fetchTitle", {
    method: "POST",
    body: JSON.stringify({ synopsis }),
    headers: { "Content-Type": "application/json" },
  });
  const data = await response.json();
  const title = data.title.trim();
  document.getElementById("output-title").innerText = title;
  fetchImageUrl(synopsis);
}

async function fetchStars(synopsis) {
  const response = await fetch("/.netlify/functions/fetchStars", {
    method: "POST",
    body: JSON.stringify({ synopsis }),
    headers: { "Content-Type": "application/json" },
  });
  const data = await response.json();
  document.getElementById("output-stars").innerText = data.stars.trim();
}

async function fetchImageUrl(imagePrompt) {
  const response = await fetch("/.netlify/functions/fetchImageUrl", {
    method: "POST",
    body: JSON.stringify({ imagePrompt }),
  });
  const { imageUrl } = await response.json();
  console.log("image url ", imageUrl);
  const imgElement = document.createElement("img");
  imgElement.src = imageUrl;
  document.getElementById("output-img-container").appendChild(imgElement);

  document.getElementById("setup-container").style.display = "none";
  document.getElementById("output-container").style.display = "flex";
  movieBossText.innerText = `This idea is so good I'm jealous! It's gonna make you rich for sure! Remember, I want 10% 💰`;
}
