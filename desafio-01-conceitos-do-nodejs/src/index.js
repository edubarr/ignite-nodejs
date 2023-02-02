const express = require("express");
const cors = require("cors");
const { v4: uuidv4 } = require("uuid");

const app = express();

app.use(cors());
app.use(express.json());

const users = [];

function checksExistsUserAccount(request, response, next) {
  const { username } = request.headers;

  const user = users.find((user) => user.username === username);

  if (!user) {
    return response.status(404).json({ error: "User not found!" });
  }

  request.user = user;

  return next();
}

function getTodo(user, id) {
  return user.todos.find((todo) => todo.id === id);
}

app.post("/users", (request, response) => {
  const { name, username } = request.body;

  const userAlreadyExists = users.some((user) => user.username === username);

  if (userAlreadyExists) {
    return response.status(400).json({ error: "User already exists!" });
  }

  const newUser = {
    id: uuidv4(),
    name: name,
    username: username,
    todos: [],
  };

  users.push(newUser);

  return response.json(newUser);
});

app.get("/todos", checksExistsUserAccount, (request, response) => {
  const user = request.user;

  return response.status(201).json(user.todos);
});

app.post("/todos", checksExistsUserAccount, (request, response) => {
  const user = request.user;

  const { title, deadline } = request.body;

  const newTodo = {
    id: uuidv4(),
    title: title,
    done: false,
    deadline: new Date(deadline),
    created_at: new Date(),
  };

  user.todos.push(newTodo);

  return response.status(201).json(newTodo);
});

app.put("/todos/:id", checksExistsUserAccount, (request, response) => {
  const user = request.user;
  const id = request.params.id;

  const { title, deadline } = request.body;

  const todo = getTodo(user, id);

  if (todo) {
    todo.title = title;
    todo.deadline = deadline;

    return response.status(201).json(todo);
  }

  return response.status(404).json({ error: "Not Found!" });
});

app.patch("/todos/:id/done", checksExistsUserAccount, (request, response) => {
  const user = request.user;
  const id = request.params.id;

  const todo = getTodo(user, id);

  if (todo) {
    todo.done = true;

    return response.status(201).json(todo);
  }
  return response.status(404).json({ error: "Not Found!" });
});

app.delete("/todos/:id", checksExistsUserAccount, (request, response) => {
  const user = request.user;
  const id = request.params.id;

  const todo = getTodo(user, id);

  if (todo) {
    user.todos.splice(
      user.todos.findIndex((todo) => todo.id === id),
      1
    );

    return response.status(204).send();
  }
  return response.status(404).json({ error: "Not Found!" });
});

module.exports = app;
