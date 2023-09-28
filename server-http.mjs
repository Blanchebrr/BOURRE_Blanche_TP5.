import http from "node:http";

const host = "localhost";
const port = 8000;

// function requestListener(_request, response) {
//   response.writeHead(200);
//   response.end("<html><h1>My first server!<h1></html>");
// }

// function requestListener(_request, response) {
//     response.setHeader("Content-Type", "application/json");
//     response.end(JSON.stringify({ message: "I'm OK" }));
//   }

import fs from "node:fs/promises";

// function requestListener(_request, response) {
//   fs.readFile("index.html", "utf8")
//     .then((contents) => {
//       response.setHeader("Content-Type", "text/html");
//       response.writeHead(200);
//       return response.end(contents);
//     })
//     .catch((error) => console.error(error));
// }

// async function requestListener(_requete, réponse) {
//   try {
//     const contenu = await fs.readFile("index.html", "utf8");
//     réponse.setHeader("Content-Type", "text/html");
//     réponse.writeHead(200);
//     réponse.end(contenu);
//   } catch (erreur) {
//     console.error(erreur);
//     réponse.writeHead(500);
//     réponse.end("Erreur interne du serveur");
//   }
// }


// async function requestListener(request, response) {
//   response.setHeader("Content-Type", "text/html");
//   try {
//     const contents = await fs.readFile("index.html", "utf8");
//     switch (request.url) {
//       case "/index.html":
//         response.writeHead(200);
//         return response.end(contents);
//       case "/random/:nb":
//         response.writeHead(200);
//         return response.end(`<html><p>${Math.floor(100 * Math.random())}</p></html>`);
//       default:
//         response.writeHead(404);
//         return response.end(`<html><p>404: NOT FOUND</p></html>`);
//     }
//   } catch (error) {
//     console.error(error);
//     response.writeHead(500);
//     return response.end(`<html><p>500: INTERNAL SERVER ERROR</p></html>`);
//   }
// }

//Fin partie 1 random
async function requestListener(request, response) {
  response.setHeader("Content-Type", "text/html");
  try {
    const urlSegments = request.url.split("/");
    const firstSegment = urlSegments[1]; // Récupérer le premier segment de l'URL

    switch (firstSegment) {
      case "":
      case "index.html":
        // Traiter à la fois / et /index.html de la même manière
        const contents = await fs.readFile("index.html", "utf8");
        response.writeHead(200);
        response.end(contents);
        break;
      case "random.html":
        // Vérifier si le deuxième segment est un entier valide
        const nb = parseInt(urlSegments[2]);
        if (!isNaN(nb) && nb > 0) {
          // Générer le nombre spécifié de nombres aléatoires
          const randomNum = generateRandomNumbers(nb);
          response.writeHead(200);
          response.end(`<html><p>${randomNum.join("<br>")}</p></html>`);
        } else {
          response.writeHead(400); // Requête incorrecte
          response.end(`<html><p>400: Requête incorrecte</p></html>`);
        }
        break;
      default:
        response.writeHead(404);
        response.end(`<html><p>404 : NON TROUVE</p></html>`);
    }
  } catch (error) {
    console.error(error);
    response.writeHead(500);
    response.end(`<html><p>500 : ERREUR INTERNE DU SERVEUR</p></html>`);
  }
}

function generateRandomNumbers(count) {
  const randomNumbers = [];
  for (let i = 0; i < count; i++) {
    randomNumbers.push(Math.floor(100 * Math.random()));
  }
  return randomNumbers;
}


const server = http.createServer(requestListener);
server.listen(port, host, () => {
  console.log(`Server is running on http://${host}:${port}`);
});

console.log("NODE_ENV =", process.env.NODE_ENV);
