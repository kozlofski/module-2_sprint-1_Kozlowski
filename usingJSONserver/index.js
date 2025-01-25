document.addEventListener("DOMContentLoaded", () => {
  console.log("DOM loaded");
  initRadioFilters();
  initNameFilter();

  renderCharacters();

  initPageBtns();
  initNewCharacterBtn();
});

// const BASE_URL = "https://rickandmortyapi.com/api/character/";
const JSON_SERVER_URL = "http://localhost:3000/results";
const defaultImageUrl =
  "https://rickandmortyapi.com/api/character/avatar/3.jpeg";

const errorMessage = `Nie znaleziono postaci spełniających kryteria wyszukiwania.`;

let CURRENT_URL = "";
let selectedStatus = "alive";
let currentPage = 1;
let paginationLimit = 20;
let maxPages = 0;

// === INIT FUNCTIONS === //

function initRadioFilters() {
  const radioButtons = document.querySelectorAll(".filter-status");
  //   console.log(radioButtons);
  radioButtons.forEach((button) =>
    button.addEventListener("click", () => {
      selectedStatus = button.value;
      currentPage = 1;
      renderCharacters();
    })
  );
}

function initNameFilter() {
  const nameInput = document.getElementById("filter-name");
  nameInput.addEventListener("input", () => {
    currentPage = 1;
    renderCharacters();
  });
}

function initPageBtns() {
  const pageBtns = document.querySelectorAll(".page-btn");
  pageBtns.forEach((btn) =>
    btn.addEventListener("click", () => {
      if (btn.value === ">") {
        ++currentPage;
        if (currentPage > maxPages) {
          currentPage = maxPages;
        } else {
          renderCharacters();
        }
      } else {
        --currentPage;
        if (currentPage < 1) {
          currentPage = 1;
        } else {
          renderCharacters();
        }
      }
      console.log(currentPage);
    })
  );
}

function initNewCharacterBtn() {
  const createBtn = document.getElementById("create-new-character");
  createBtn.addEventListener("click", createCharacter);
}

// === MAIN FUNCTIONALITY === //

function renderCharacters() {
  document.getElementById("characters").innerHTML = "";
  const allCharactersPromise = fetchCharacters();
  allCharactersPromise
    .then((c) => c.forEach((character) => renderCharacter(character)))
    .catch((e) => renderErrorMessage(e));
}

function renderErrorMessage(e) {
  console.error(e);
  document.getElementById("characters").innerHTML = errorMessage;
}

async function fetchCharacters() {
  try {
    const URL = buildUrl();
    console.log(URL);
    const response = await fetch(URL);
    // console.log(response);
    const allCharactersData = await response.json();
    // console.log(allCharactersData);

    maxPages = 2;
    console.dir(allCharactersData);
    return allCharactersData;
  } catch (error) {
    return errorMessage;
  }
}

function buildUrl() {
  const searchParams = new URLSearchParams();

  searchParams.append("_page", currentPage);

  const inputName = document.getElementById("filter-name").value;
  // if (inputName !== "") searchParams.append("name", inputName);

  // searchParams.append("status", selectedStatus);

  console.log("query params", searchParams.toString());
  return `${JSON_SERVER_URL}?${searchParams.toString()}`;
  // return `${JSON_SERVER_URL}`;
}

function createElement(tag, container, ...classes) {
  let parentElement;
  if (typeof container === "string") {
    parentElement = document.getElementById(container);
  } else {
    parentElement = container;
  }

  const newElement = document.createElement(tag);
  parentElement.appendChild(newElement);
  newElement.classList.add(...classes);
  return newElement;
}

function renderCharacter(characterData) {
  const characterDiv = createElement("div", "characters", "character-card");
  const characterPic = createElement("div", characterDiv, "character-pic");

  characterPic.setAttribute(
    "style",
    `background-image: url('${characterData.image}');`
  );

  const characterH2 = createElement("h2", characterDiv, "character-h2");
  characterH2.innerHTML = characterData.name;

  const characterProperties = createElement(
    "ul",
    characterDiv,
    "character-properties"
  );
  const characterStatus = createElement(
    "li",
    characterProperties,
    "character-property"
  );
  characterStatus.innerHTML = `Status: ${characterData.status}`;
  const characterSpecies = createElement(
    "li",
    characterProperties,
    "character-property"
  );
  characterSpecies.innerHTML = `Gatunek: ${characterData.species}`;

  const deleteButton = createElement(
    "button",
    characterDiv,
    "character-delete-btn"
  );
  deleteButton.id = characterData.id;

  deleteButton.innerHTML = `Usuń postać`;
  deleteButton.addEventListener("click", (e) => {
    e.preventDefault();
    const id = characterData.id;
    deleteCharacter(id);
  });
}

async function deleteCharacter(id) {
  await fetch(`${JSON_SERVER_URL}/${id}`, {
    method: "DELETE",
  });
  renderCharacters();
}

async function createCharacter() {
  const characterName = document.getElementById("new-character-name").value;
  const characterStatus = document.getElementById("new-character-status").value;
  const characterRace = document.getElementById("new-character-race").value;

  const newCharacter = {
    name: characterName,
    status: characterStatus,
    species: characterRace,
    image: defaultImageUrl,
  };

  const response = await fetch(JSON_SERVER_URL, {
    method: "POST",
    headers: {
      "content-type": "application/json",
    },
    body: JSON.stringify(newCharacter),
  });
}
