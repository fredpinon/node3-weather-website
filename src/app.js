const path = require("path");
const express = require("express");
const hbs = require("hbs");

const geocode = require("./utils/geocode");
const forecast = require("./utils/forecast");

const app = express();

// Define paths for Express config
const publicDirectoryPath = path.join(__dirname, "../public");
const viewsPath = path.join(__dirname, "../templates/views");
const partialsPath = path.join(__dirname, "../templates/partials");

// Setup handlebars engine and views location
app.set("view engine", "hbs");
app.set("views", viewsPath); // now the views directory is the web server root
hbs.registerPartials(partialsPath);

// Setup static directory to serve
app.use(express.static(publicDirectoryPath));
// express static takes the absolute path to the directory holding the files we will serve to the front end from this server (the public files)
// doing this, allows to serve these files and sets the public directory as the web server root. Now going to http://localhost:3000/ serves the index.html file. As there is none, express won't find a match
// in the public directory when we hit that url, instead it will continue down the route handlers and in our case use app.get('', ...);
// express.static probably sets up some things and returns a function that takes req, res, and next which will be called on every request.

app.get("", (req, res) => {
  // res.render allows to render one of or hbs views.
  // Express knows to go get the index file from the views directory (need to specify where this views directory is (using app.set('views', viewsPath);) if it is not exactly in the project directory root)
  // express converts the content to html and send the response.
  res.render("index", {
    title: "Weather App",
    name: "Fred",
  });
});

app.get("/about", (req, res) => {
  res.render("about", {
    title: "About me",
    name: "Fred",
  });
});

app.get("/help", (req, res) => {
  res.render("help", {
    helpText: "These are the help instructions",
    title: "Help",
    name: "Fred",
  });
});

app.get("/weather", (req, res, next) => {
  const address = req.query.address;
  if (!address) {
    return res.send({
      error: "You must provide an address!",
    });
  }
  geocode(address, (error, { longitude, latitude, location } = {}) => {
    if (error) return res.send({ error });
    forecast({ longitude, latitude, location }, (error, forecast) => {
      if (error) return res.send({ error });

      res.send({
        forecast,
        location,
        address,
      });
    });
  });
});

app.get("/help/*", (req, res) => {
  res.render("404", {
    errorMessage: "Help article not found.",
    title: "404",
    name: "Fred",
  });
});

// route handler that matches everything that hasn't been matched so far
app.get("*", (req, res) => {
  res.render("404", {
    errorMessage: "Page not found.",
    title: "404",
    name: "Fred",
  });
});

app.listen(3000, () => {
  console.log("Server running on port 3000");
});
