const searchTabButton = document.querySelector("#search-button");
const favoritesTabButton = document.querySelector("#favorites-button");
const searchTab = document.querySelector("#search-tab");
const favoritesTab = document.querySelector("#favorites-tab");
const input = document.querySelector("#query");
const searchButton = document.querySelector("#search");
let albums = [];
let favoritedAlbums = [];

searchTabButton.addEventListener("click", () => {
  favoritesTabButton.classList.remove("active");
  searchTabButton.classList.add("active");
  searchTab.classList.remove("d-none");
  favoritesTab.classList.add("d-none");
});

favoritesTabButton.addEventListener("click", () => {
  searchTabButton.classList.remove("active");
  favoritesTabButton.classList.add("active");
  favoritesTab.classList.remove("d-none");
  searchTab.classList.add("d-none");
  displayFavoriteAlbums();
});

function displayAlbums(albums) {
  const container = document.querySelector("#search-results");
  container.innerHTML = "";
  albums.forEach((album) => {
    const htmlContent = `
    <li class="list-group-item d-flex justify-content-between align-items-start">
        <div class="ms-2 me-auto">
            <div class="fw-bold">
                ${album.albumName}
                <span class="badge bg-primary rounded-pill">${album.averageRating}</span>
            </div>
            <span>${album.artistName}</span>
        </div>
        <button type="button" class="btn btn-success favorite-button" id=${album.id}>Add to Favorites</button>
    </li>`;
    container.insertAdjacentHTML("beforeend", htmlContent);
  });
  const favoriteButtons = document.querySelectorAll(".favorite-button");
  favoriteButtons.forEach((button) =>
    button.addEventListener("click", addToFavorites)
  );
}

function displayFavoriteAlbums() {
  const container = document.querySelector("#favorites");
  container.innerHTML = "";
  favoritedAlbums.forEach((album) => {
    const htmlContent = `
    <li class="list-group-item d-flex justify-content-between align-items-start">
        <div class="ms-2 me-auto">
            <div class="fw-bold">
                ${album.albumName}
                <span class="badge bg-primary rounded-pill">${album.averageRating}</span>
            </div>
            <span>${album.artistName}</span>
        </div>
        <button type="button" class="btn btn-success unfavorite-button" id=${album.id}>Remove From Favorites</button>
    </li>`;
    container.insertAdjacentHTML("beforeend", htmlContent);
  });
  const favoriteButtons = document.querySelectorAll(".unfavorite-button");
  favoriteButtons.forEach((button) =>
    button.addEventListener("click", removeFromFavorites)
  );
}

searchButton.addEventListener("click", async (event) => {
  event.preventDefault();
  const albumsCopy = [...albums];
  const query = input.value.trim().toLowerCase();
  const filteredAlbums = albumsCopy.filter((album) => {
    const artistMatch = album.artistName.toLowerCase().includes(query);
    const albumMatch = album.albumName.toLowerCase().includes(query);
    return artistMatch || albumMatch;
  });
  displayAlbums(filteredAlbums);
});

async function addToFavorites(event) {
  const favoritedAlbum = albums.find((album) => album.id === event.target.id);
  const exists = favoritedAlbums.find(
    (albums) => albums.id === favoritedAlbum.id
  );
  if (exists) {
    return;
  }
  try {
    await fetch(
      "https://660ded886ddfa2943b3573c8.mockapi.io/api/v1/favorites",
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(favoritedAlbum),
        redirect: "follow",
      }
    );
    favoritedAlbums.push(favoritedAlbum);
  } catch (error) {
    console.error("Error adding album to favorites:", error);
  }
}

function removeFromFavorites(event) {
  favoritedAlbums = favoritedAlbums.filter(
    (album) => album.id !== event.target.id
  );
  displayFavoriteAlbums();
}

async function appInit() {
  const [albumsResponse, favoritesResponse] = await Promise.all([
    fetch("https://660ded886ddfa2943b3573c8.mockapi.io/api/v1/albums"),
    fetch("https://660ded886ddfa2943b3573c8.mockapi.io/api/v1/favorites"),
  ]);

  albums = await albumsResponse.json();
  favoritedAlbums = await favoritesResponse.json();
}

appInit();
