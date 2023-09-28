import express from "express";
import morgan from "morgan";
import ejs from "ejs";
import createError from "http-errors";
import logger from "loglevel";

logger.setLevel(logger.levels.DEBUG);
logger.setLevel(logger.levels.WARN);

const host = "localhost";
const port = 8000;

const app = express();


// Activer le middleware Morgan uniquement en mode développement
if (app.get("env") === "development") {
    app.use(morgan("dev"));
  }

// Configuration du moteur de templating EJS
app.set("view engine", "ejs");

app.use(express.static("static"));

// app.get(["/", "/index.html"], async function (request, response, next) {
//   response.sendFile("index.html", { root: "./" });
// });

// app.get("/random/:nb", async function (request, response, next) {
//   const length = request.params.nb;
//   const contents = Array.from({ length })
//     .map((_) => `<li>${Math.floor(100 * Math.random())}</li>`)
//     .join("\n");
//   return response.send(`<html><ul>${contents}</ul></html>`);
// });

// app.get("/random/:nb", async function (request, response, next) {
//     const length = request.params.nb;
//     const numbers = Array.from({ length }).map(() => Math.floor(100 * Math.random()));
//     const welcome = "Welcome to the Random Numbers Page";
  
    
//     response.render("random", { numbers, welcome });
//   });

app.get("/random/:nb", async function (request, response, next) {
    const length = Number.parseInt(request.params.nb, 10);
  
    if (Number.isNaN(length)) {
      return next(createError(400, "Invalid number"));
    }
  
    const numbers = Array.from({ length }).map(() => Math.floor(100 * Math.random()));
    const welcome = "Welcome to the Random Numbers Page";
  
    response.render("random", { numbers, welcome });
  });


// // Gestionnaire de route par défaut pour les routes non trouvées
// app.use((request, response, next) => {
//     console.debug(`default route handler : ${request.url}`);
//     return next(createError(404));
// });

// Gestionnaire de route par défaut pour les routes non trouvées
app.use((request, response, next) => {
    logger.debug(`default route handler : ${request.url}`); // Changé cette ligne
    return next(createError(404));
});

// // Gestionnaire d'erreur par défaut
// app.use((error, _request, response, _next) => {
//     console.debug(`default error handler: ${error}`);
//     const status = error.status ?? 500;
//     const stack = app.get("env") === "development" ? error.stack : "";
//     const result = { code: status, message: error.message, stack };
//     return response.render("error", result);
// });

// Gestionnaire d'erreur par défaut
app.use((error, _request, response, _next) => {
    logger.error(`default error handler: ${error}`); // Changé cette ligne
    const status = error.status ?? 500;
    const stack = app.get("env") === "development" ? error.stack : "";
    const result = { code: status, message: error.message, stack };
    return response.render("error", result);
});

const server = app.listen(port, host);


// server.on("listening", () =>
//   console.info(
//     `HTTP listening on http://${server.address().address}:${server.address().port} with mode '${process.env.NODE_ENV}'`,
//   ),
// );

server.on("listening", () =>
    logger.info(
        `HTTP listening on http://${server.address().address}:${server.address().port} with mode '${process.env.NODE_ENV}'`, // Changé cette ligne
    ),
);


//console.info(`File ${import.meta.url} executed.`);
logger.info(`File ${import.meta.url} executed.`);