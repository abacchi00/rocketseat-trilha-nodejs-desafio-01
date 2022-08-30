const express = require('express');
const cors = require('cors');

const { v4: uuidv4 } = require('uuid');

const app = express();

app.use(cors());
app.use(express.json());

const users = [];

const findUser = (username) => users.find(user => user.username === username);

function checksExistsUserAccount(request, response, next) {
  const { username } = request.headers;

  const user = findUser(username);

  if (!user) return response.status(400).json({ error: 'User not found for request header\'s username' });

  request.user = user;

  return next();
}

app.post('/users', (request, response) => {
  const { name, username } = request.body;

  if (!!findUser(username)) return response.status(400).json({ error: 'Propriedade "username" já utilizada para algum usuário existente!' })

  const newUser = { name, username, id: uuidv4(), todos: [] };

  users.push(newUser);

  return response.status(201).json(newUser);
});

app.get('/todos', checksExistsUserAccount, (request, response) => {
  const { user } = request;

  return response.json(user.todos);
});

app.post('/todos', checksExistsUserAccount, (request, response) => {
  const { title, deadline } = request.body;
  const { user } = request;

  const newTodo = {
    title,
    deadline: new Date(deadline + '00:00'),
    id: uuidv4(),
    created_at: new Date(),
    done: false,
  };

  user.todos.push(newTodo);

  return response.status(201).json(newTodo);
});

app.put('/todos/:id', checksExistsUserAccount, (request, response) => {
  // Complete aqui
});

app.patch('/todos/:id/done', checksExistsUserAccount, (request, response) => {
  // Complete aqui
});

app.delete('/todos/:id', checksExistsUserAccount, (request, response) => {
  // Complete aqui
});

module.exports = app;