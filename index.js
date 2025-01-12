document.addEventListener("DOMContentLoaded", () => console.log("DOM oaded"));

const BASE_URL = "https://rickandmortyapi.com/api/character";

//testing
async function loadAllCharacters() {
  try {
    const response = await fetch(BASE_URL);
    const json = await response.json();

    console.dir(json);
  } catch (error) {}
}

async function getCharacter(id) {
  try {
    const response = await fetch(`${BASE_URL}/${id}`);
    const characterData = await response.json();
    return characterData;
  } catch (error) {}
}

// loadAllCharacters();
const promise = getCharacter(1);
promise.then((v) => renderCharacter(v));

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
  console.log("character div: ", characterDiv);
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
