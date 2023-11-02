import ".style.css";
import countries from "./country-capitals.js";

const colorBackground = "#293251";

let input = document.querySelector(".search-bar");
input.style.border = "1px solid grey";

let message = document.querySelector(".message");
message.style.color = "red";

const button = document.querySelector(".search-button");

const location = document.querySelector(".location");
const temperatureValue = document.querySelector(".temperature-value");
const temperatureDescription = document.querySelector(
  ".temperature-description"
);
const weatherIcon = document.querySelector(".weather-icon-img");

const submittedLabel = "Formulaire envoyé";

const disabledButtonStyle = {
  color: "red",
  "border-color": "red",
  cursor: "not-allowed",
  "background-color": "--color-red-light40"
};

const enableButtonStyle = {
  color: "white",
  "border-color": "#293251",
  cursor: "pointer",
  "background-color": colorBackground
};

const setStyle = (element, style) => {
  for (const property in style) {
    element.style[property] = style[property];
  }
};

const setButtonMouseOut = function (e) {
  e.currentTarget.style.color = "white";
  e.currentTarget.style.backgroundColor = colorBackground;
  e.currentTarget.style.border = "1px solid #293251";
};

const setButtonMouseOver = function (e) {
  e.currentTarget.style.color = colorBackground;
  e.currentTarget.style.backgroundColor = "white";
  e.currentTarget.style.border = "1px solid white";
};

const setFormErrorAVide = (e) => {
  input.style.border = "1px solid red";
  e.currentTarget.setAttribute("disabled", true);
  e.currentTarget.children[0].textContent = "Champ Obligatoire";
  setStyle(e.currentTarget, disabledButtonStyle);
  message.style.display = "none";
  button.removeEventListener("mouseout", setButtonMouseOut);
  button.removeEventListener("mouseover", setButtonMouseOver);
  input.focus();
};

const setFormErrorPasVideEtPasTrouve = (e) => {
  input.style.border = "1px solid red";
  e.currentTarget.setAttribute("disabled", true);
  e.currentTarget.children[0].textContent = "Capitale introuvable";
  setStyle(e.currentTarget, disabledButtonStyle);
  message.style.display = "none";
  button.removeEventListener("mouseout", setButtonMouseOut);
  button.removeEventListener("mouseover", setButtonMouseOver);
  input.focus();
};

async function setFormSuccess() {
  const response = await fetch(
    `https://react-starter-api.vercel.app/api/meteo/${input.value}}`
  );
  if (response.ok) {
    const meteo = await response.json();
    location.textContent = meteo.name;
    temperatureValue.textContent = (meteo.main.temp - 273.15).toFixed(0);
    temperatureDescription.textContent = meteo.weather[0].description;
    weatherIcon.src = `./icons/${meteo.weather[0].icon}.png`;
    input.value = "";
    input.focus();
  } else {
    console.log("Retour serveur : ", response.status);
  }
}

const isInTheAPI = (country) => {
  let isIn = false;
  for (let i = 0; i < countries.length; i++) {
    if (countries[i].name.toLowerCase() === country.toLowerCase()) {
      isIn = true;
    }
  }
  return isIn;
};

const sendForm = function (e) {
  e.preventDefault();
  e.currentTarget.children[0].textContent = submittedLabel;
  if (input.value === "") {
    setFormErrorAVide(e);
  } else if (!isInTheAPI(input.value)) {
    setFormErrorPasVideEtPasTrouve(e);
  } else if (isInTheAPI(input.value)) {
    setFormSuccess();
  }
};

const cleanForm = function (e) {
  e.currentTarget.children[0].textContent = "";
  if (e.target.value !== "") {
    e.target.style.borderColor = "grey";
    button.removeAttribute("disabled");
    setStyle(button, enableButtonStyle);
    addEventsButton();
    message.textContent = "";
    e.target.value = "";
  }
};

const addEventsButton = () => {
  button.addEventListener("mouseenter", setButtonMouseOver);
  button.addEventListener("mouseleave", setButtonMouseOut);
  button.addEventListener("click", sendForm);
};

input.addEventListener("keyup", cleanForm);

addEventsButton();
