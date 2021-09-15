const express = require("express");
const cors = require("cors");

const { v4: uuid, validate: isUuid } = require('uuid');

const app = express();

app.use(express.json());
app.use(cors());

const repositories = [];

app.get("/repositories", (req, res) => {
  res.send(repositories);
});

app.post("/repositories", (req, res) => {
  const { title, url, techs } = req.body;

  const repository = {
    id: uuid(),
    title: title,
    url: url,
    techs: techs,
    likes: 0
  }

  repositories.push(repository);

  res.send(repository);
});

app.put("/repositories/:id", (req, res) => {
  const { id } = req.params;
  const { title, url, techs } = req.body;
  const validadeId = !isUuid(id);

  const repositoryIndex = repositories.findIndex(
    repository => repository.id === id
  );

  if (validadeId || repositoryIndex < 0) {
    return res.status(400).send({ error: 'Repository not found' });
  }
  
  const likes = repositories[repositoryIndex].likes;

  repositories[repositoryIndex] = {
    id: id,
    title: title,
    url: url,
    techs: techs,
    likes: likes
  }

  res.send(repositories[repositoryIndex]);
});

app.delete("/repositories/:id", (req, res) => {
  const { id } = req.params;
  const validadeId = !isUuid(id);

  const repositoryIndex = repositories.findIndex(
    repository => repository.id === id
  );

  if(validadeId || repositoryIndex < 0) {
      return res.status(400).send({ error: 'Repository not found' });
  }

  repositories.splice(repositoryIndex, 1);

  res.status(204).send("OK");
});

app.post("/repositories/:id/like", (req, res) => {
  const { id } = req.params;
  const validadeId = !isUuid(id);

  const repositoryIndex = repositories.findIndex(
    repository => repository.id === id
  );

  if (validadeId || repositoryIndex < 0) {
    return res.status(400).send({ error: 'Repository not found' });
  }

  repositories[repositoryIndex].likes += 1;

  res.send(repositories[repositoryIndex]);
});

module.exports = app;
