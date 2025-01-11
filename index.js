document.addEventListener("DOMContentLoaded", () => console.log("loaded"));

const BASE_URL = "https://rickandmortyapi.com/api/character";

//testing
async function loadAllCharacters() {
  try {
    const response = await fetch(BASE_URL);
    const json = await response.json();

    const body = document.querySelector("body");
    console.dir(json);
  } catch (error) {}
}

loadAllCharacters();
