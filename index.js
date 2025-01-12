document.addEventListener("DOMContentLoaded", () => {
  console.log("DOM loaded");
  initRadioFilters();
  initNameFilter();
  renderCharacters();
});

const BASE_URL = "https://rickandmortyapi.com/api/character/";
let CURRENT_URL = "";
let selectedStatus = "";

function initRadioFilters() {
  const radioButtons = document.querySelectorAll(".filter-status");
  //   console.log(radioButtons);
  radioButtons.forEach((button) =>
    button.addEventListener("click", () => {
      selectedStatus = button.value;
      //   console.log(selectedStatus);
      renderCharacters();
    })
  );
}

function initNameFilter() {
  const nameInput = document.getElementById("filter-name");
  nameInput.addEventListener("input", () => renderCharacters());
}

function renderCharacters() {
  document.getElementById("characters").innerHTML = "";
  const allCharactersPromise = loadAllCharacters();
  allCharactersPromise.then((c) =>
    c.results.forEach((character) => renderCharacter(character))
  );
}

function buildUrl() {
  let queryParams = "";
  //until status is not selected this should be empty
  const statusQuery = selectedStatus === "" ? "" : `status=${selectedStatus}`;
  const inputName = document.getElementById("filter-name").value;
  const nameQuery = inputName === "" ? "" : `name=${inputName}`;
  if (statusQuery !== "" || nameQuery !== "") queryParams = `?`;
  if (statusQuery !== "") queryParams = `${queryParams}${statusQuery}`;
  if (statusQuery !== "" && nameQuery !== "") queryParams = `${queryParams}&`;
  if (nameQuery !== "") queryParams = `${queryParams}${nameQuery}`;

  console.log("filter-name:", name);
  return `${BASE_URL}${queryParams}`;
}

async function loadAllCharacters() {
  try {
    const URL = buildUrl();
    console.log(URL);
    const response = await fetch(URL);
    const allCharactersData = await response.json();

    return allCharactersData;
  } catch (error) {
    console.error("Error with loading characters", error);
  }
}

// to be deleted
async function getCharacter(id) {
  try {
    const response = await fetch(`${BASE_URL}/${id}`);
    const characterData = await response.json();
    return characterData;
  } catch (error) {
    console.error(`Error with loading character no ${id}`, error);
  }
}

// const allCharactersPromise = loadAllCharacters();
// allCharactersPromise.then((c) =>
//   c.results.forEach((character) => renderCharacter(character))
// );

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
  //   console.log("character div: ", characterDiv);
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
}
