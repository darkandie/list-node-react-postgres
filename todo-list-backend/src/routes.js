const express = require('express');

const allTodos = [{name: 'Carlos', status: false}];
const todosRoutes = express.Router()
const {PrismaClient} = require('@prisma/client');

const prisma = new PrismaClient();

todosRoutes.post('/todos', async (req, res) => {
  const {name} = req.body;
  const todo = await prisma.todo.create({
    data: {
      name,
    }
  })
  return res.status(201).json(todo);
})

todosRoutes.get('/todos', async (req, res) => {
  const todos = await prisma.todo.findMany()
  return res.status(200).json(todos);
})

todosRoutes.put('/todos', async (req, res) => {
  const { name, id, status } = req.body;

  if(!id) {
    return res.status(400).json('Id is mandatory');
  }

  const todoAlreadyExist = await prisma.todo.findUnique({ where: { id } })

  if(!todoAlreadyExist) {
    return res.status(404).json("Todo not exist")
  }

  const todo = await prisma.todo.update({
    where: {
      id,
    },
    data: {
      name,
      status
    }
  })

  return res.status(200).json(todo);
})

todosRoutes.delete('/todos/:id', async (req, res) => {
  const { id } = req.params;

  const intId = parseInt(id);

  if(!intId) {
    return res.status(400).json('Id is mandatory');
  }

  const todoAlreadyExist = await prisma.todo.findUnique({ where: { id: intId } })

  if(!todoAlreadyExist) {
    return res.status(404).json("Todo not exist")
  }

  await prisma.todo.delete({where:{ id: intId }})
  return res.status(200).send();
})

module.exports = todosRoutes;