const apiKey = 'nKgfbOgAYgouYwdAy51hqzbrbbgYIfVF'; // Replace with your Giphy API key
const form = document.getElementById('search-form');
const input = document.getElementById('search-input');
const gifContainer = document.getElementById('gif-container');
const modal = document.getElementById('modal');
const modalGif = document.getElementById('modal-gif');
const downloadLink = document.getElementById('download-link');
const closeButton = document.querySelector('.close-button');
const loader = document.getElementById('loader');
const sectionTitle = document.getElementById('section-title');

// Load trending GIFs on page load
window.addEventListener('DOMContentLoaded', async () => {
  showLoader();
  const trendingGIFs = await fetchTrendingGIFs();
  hideLoader();
  displayGIFs(trendingGIFs);
});

// Handle search form submission
form.addEventListener('submit', async (e) => {
  e.preventDefault();
  const query = input.value.trim();
  if (!query) return;
  showLoader();
  const searchResults = await fetchSearchGIFs(query);
  hideLoader();
  displayGIFs(searchResults);
  sectionTitle.textContent = `Результаты поиска по запросу: "${query}"`;
});

// Fetch trending GIFs
async function fetchTrendingGIFs() {
  const response = await fetch(
    `https://api.giphy.com/v1/gifs/trending?api_key=${apiKey}&limit=55`
  );
  const data = await response.json();
  return data.data;
}

// Fetch search results
async function fetchSearchGIFs(query) {
  const response = await fetch(
    `https://api.giphy.com/v1/gifs/search?api_key=${apiKey}&q=${query}&limit=55`
  );
  const data = await response.json();
  return data.data;
}

// Display GIFs
function displayGIFs(gifs) {
  gifContainer.innerHTML = '';
  gifs.forEach((gif) => {
    const img = document.createElement('img');
    img.src = gif.images.fixed_height_small.url;
    img.alt = gif.title;
    img.classList.add('gif');
    img.addEventListener('click', () => openModal(gif.images.original.url));
    gifContainer.appendChild(img);
  });
}

// Open modal with direct download
function openModal(gifUrl) {
  modal.style.display = 'flex';
  modalGif.src = gifUrl;

  // Direct download setup
  downloadLink.onclick = (e) => {
    e.preventDefault();
    downloadGIF(gifUrl);
  };
}

// Download GIF
async function downloadGIF(gifUrl) {
  const response = await fetch(gifUrl);
  const blob = await response.blob();
  const url = URL.createObjectURL(blob);

  // Create a temporary link to trigger download
  const tempLink = document.createElement('a');
  tempLink.href = url;
  tempLink.download = 'download.gif'; // Default filename
  document.body.appendChild(tempLink);
  tempLink.click();

  // Cleanup
  document.body.removeChild(tempLink);
  URL.revokeObjectURL(url);
}



// Close modal
closeButton.addEventListener('click', () => {
  modal.style.display = 'none';
});

modal.addEventListener('click', (e) => {
  if (e.target === modal) {
    modal.style.display = 'none';
  }
});

// Show loader
function showLoader() {
  loader.style.display = 'flex';
}

// Hide loader
function hideLoader() {
  loader.style.display = 'none';
}
