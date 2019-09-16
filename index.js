const express = require("express");

const server = express();

server.use(express.json());

const projects = [];

/**
 * Cria um novo projeto
 */
server.post("/projects", (req, res) => {
  const { id } = req.body;
  const { title } = req.body;

  const project = {
    id,
    title,
    tasks: []
  };

  projects.push(project);

  return res.json(project);
});

/**
 *  Middleware
 *  Lista o número de requisições,o método e a url da requisição.
 */
server.use((req, res, next) => {
  console.log(`Método: ${req.method}; URL: ${req.url}`);

  next();

  console.count("Request");
});

/**
 * Lista todos os projetos
 */
server.get("/projects", (req, res) => {
  return res.json(projects);
});

/**
 * altera o titulo de um projeto
 */
server.put("/projects/:id", checkProjectExists, (req, res) => {
  const { title } = req.body;
  const { id } = req.params;

  const project = findOrFindIndex(".find", id);

  project.title = title;

  return res.json(project);
});

/**
 * Deleta um projeto
 */
server.delete("/projects/:id", checkProjectExists, (req, res) => {
  const { id } = req.params;

  const indexProject = findOrFindIndex(".findIndex", id);

  projects.splice(indexProject, 1);

  return res.send();
});

/**
 * Adiciona uma task para determinado projeto
 */
server.post("/projects/:id/tasks", checkProjectExists, (req, res) => {
  const { title } = req.body;
  const { id } = req.params;

  const project = findOrFindIndex(".find", id);

  project.tasks.push(title);

  return res.json(project);
});

/**
 *  Middleware
 *  Informa se o projeto existe no array
 */
function checkProjectExists(req, res, next) {
  const { id } = req.params;

  const project = findOrFindIndex(".find", id);

  if (!project) {
    return res.status(400).json({ error: "Project does not exists" });
  }

  return next();
}

/**
 * Function criada para redução de código,
 * onde decide qual tipo de busca irá fazer
 * conforme o parâmetro passado na assinatura
 */
function findOrFindIndex(typeOfSearch, id) {
  if (typeOfSearch == ".findIndex") {
    return projects.findIndex(project => project.id == id);
  } else {
    return projects.find(project => project.id == id);
  }
}

server.listen(3001);
