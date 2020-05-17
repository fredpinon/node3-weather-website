const weatherForm = document.querySelector("form");
const search = document.querySelector("input");
const messageOne = document.querySelector("#message-1");
const messageTwo = document.querySelector("#message-2");

const getData = async (location) => {
  const res = await fetch(`/weather?address=${location}`);
  const json = await res.json();
  if (json.error) {
    messageOne.textContent = json.error;
  } else {
    messageOne.textContent = json.location;
    messageTwo.textContent = json.forecast;
  }
};

weatherForm.addEventListener("submit", (e) => {
  e.preventDefault();
  messageOne.textContent = "Loading...";
  messageTwo.textContent = "";
  getData(search.value);
});
